package org.project.ecom.service;

import lombok.RequiredArgsConstructor;
import org.project.ecom.model.dto.SupplierPaymentRequest;
import org.project.ecom.model.*;
import org.project.ecom.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SupplierPaymentService {

    private final SupplierRepository supplierRepository;
    private final SupplierPaymentMethodRepository spmRepository;
    private final SupplierPaymentRepositoty paymentRepository;
    private final SupplierPaymentInvoiceRepository invoiceRepository;
    private final PurchaseRepository purchaseRepository;

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
}
