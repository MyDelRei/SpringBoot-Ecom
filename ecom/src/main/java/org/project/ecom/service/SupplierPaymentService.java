package org.project.ecom.service;

import lombok.RequiredArgsConstructor;
import org.project.ecom.model.dto.SupplierPaymentRequest;
import org.project.ecom.model.*;
import org.project.ecom.model.dto.SupplierPurchaseDetailsDTO;
import org.project.ecom.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SupplierPaymentService {

    private final SupplierRepository supplierRepository;
    private final SupplierPaymentMethodRepository spmRepository;
    private final SupplierPaymentRepositoty paymentRepository;
    private final SupplierPaymentInvoiceRepository invoiceRepository;
    private final PurchaseRepository purchaseRepository;
    private final SupplierPaymentMethodService supplierPaymentMethodService;

    @Transactional
    public void processPayment(SupplierPaymentRequest dto) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        PurchaseRequest request = purchaseRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        SupplierPaymentMethod spm = spmRepository.findById(Long.valueOf(dto.getSpm_Id()))
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        // Save SupplierPayment
        SupplierPayment payment = new SupplierPayment();
        payment.setSupplier(supplier);
        payment.setAmount(dto.getAmount());
        payment.setSpm(spm);
        payment.setRequest(request);
        payment.setPaymentDate(LocalDate.now());
        payment.setUpdatedAt(Instant.now());

        payment = paymentRepository.save(payment);

        // Save SupplierPaymentInvoice
        SupplierPaymentInvoice invoice = new SupplierPaymentInvoice();
        invoice.setPayment(payment);
        invoice.setInvoiceNumber(Long.valueOf(dto.getInvoiceNumber()));
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setUpdatedAt(Instant.now());

        invoiceRepository.save(invoice);
        updateStatusAfterPayment(dto.getRequestId());
    }

    public void updateStatusAfterPayment(Long id){
        String newStatus = "paid";
        PurchaseRequest request = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Request not found with ID: " + id));
        request.setStatus(newStatus);
        request.setUpdatedAt(LocalDateTime.now());
        purchaseRepository.save(request);
        System.out.println("Updated status of purchase request with id: " + id + " to: " + newStatus);

    }


    public List<SupplierPurchaseDetailsDTO> getAllSupplierPurchaseDetails() {
        List<Object[]> rows = paymentRepository.getAllSupplierPurchaseDetailsRaw();

        Map<Long, SupplierPurchaseDetailsDTO> grouped = new LinkedHashMap<>();

        for (Object[] row : rows) {
            Long requestId = ((Number) row[0]).longValue();
            Long supplierId = ((Number) row[1]).longValue();
            String supplierName = (String) row[2];
            String invoiceNumber = String.valueOf(row[3]);
            BigDecimal amount = (BigDecimal) row[4];
            String requestStatus = (String) row[5];
            String paymentMethod = (String) row[6];

            LocalDate paymentDate = null;
            if (row[7] != null) {
                if (row[7] instanceof Timestamp) {
                    paymentDate = ((Timestamp) row[7]).toLocalDateTime().toLocalDate();
                } else if (row[7] instanceof java.sql.Date) {
                    paymentDate = ((java.sql.Date) row[7]).toLocalDate();
                }
            }

            String skuCode = (String) row[8];
            String productName = (String) row[9];
            Integer quantityRequested = ((Number) row[10]).intValue();
            BigDecimal price = (BigDecimal) row[11];

            SupplierPurchaseDetailsDTO dto = grouped.get(requestId);
            if (dto == null) {
                dto = new SupplierPurchaseDetailsDTO(
                        requestId,
                        supplierId,
                        supplierName,
                        invoiceNumber,
                        amount,
                        requestStatus,
                        paymentMethod,
                        paymentDate,
                        new LinkedList<>()
                );
                grouped.put(requestId, dto);
            }

            dto.getSkuDetails().add(
                    new SupplierPurchaseDetailsDTO.SkuDetail(skuCode, productName, quantityRequested, price)
            );
        }

        // <-- Fix here: Return a mutable list implementation instead of List.copyOf()
        return new LinkedList<>(grouped.values());
    }




}
