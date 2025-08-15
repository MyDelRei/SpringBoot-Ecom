package org.project.ecom.service;

import org.project.ecom.model.dto.*;
import org.project.ecom.model.*;
import org.project.ecom.model.dto.PurchaseRequestDTO;
import org.project.ecom.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.sql.Blob;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final SupplierRepository supplierRepository;
    private final SkuRepository skuRepository;
    private final SupplierPaymentInvoiceRepository supplierPaymentInvoiceRepository;
    private final SupplierPaymentRepositoty supplierPaymentRepository;

    public PurchaseService(PurchaseRepository purchaseRepository,
                           PurchaseItemRepository purchaseItemRepository,
                           SupplierRepository supplierRepository,
                           SkuRepository skuRepository,
                           SupplierPaymentInvoiceRepository supplierPaymentInvoiceRepository,
                           SupplierPaymentRepositoty supplierPaymentRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseItemRepository = purchaseItemRepository;
        this.supplierRepository = supplierRepository;
        this.skuRepository = skuRepository;
        this.supplierPaymentInvoiceRepository = supplierPaymentInvoiceRepository;
        this.supplierPaymentRepository = supplierPaymentRepository;
    }

    public PurchaseRequest getPurchaseRequest(Long id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Request not found with ID: " + id));
    }

    @Transactional
    public PurchaseRequest createPurchaseRequest(PurchaseRequestDTO dto) {
        PurchaseRequest purchaseRequest = new PurchaseRequest();

        // Set supplier entity
        supplierRepository.findById(dto.getSupplierId())
                .ifPresentOrElse(purchaseRequest::setSupplier,
                        () -> { throw new RuntimeException("Supplier not found"); });

        purchaseRequest.setRequestDate(dto.getRequestDate());
        purchaseRequest.setExpectedDeliveryDate(dto.getExpectedDeliveryDate());
        purchaseRequest.setStatus(dto.getStatus());

        // Save PurchaseRequest first to get an ID
        PurchaseRequest savedRequest = purchaseRepository.save(purchaseRequest);

        // Map items and save them
        dto.getItems().forEach(itemDto -> {
            PurchaseItem item = new PurchaseItem();
            item.setRequest(savedRequest);

            skuRepository.findById(itemDto.getSkuId())
                    .ifPresentOrElse(item::setSku,
                            () -> { throw new RuntimeException("Sku not found"); });

            item.setQuantityRequest(itemDto.getQuantityRequest());
            purchaseItemRepository.save(item);
        });

        return savedRequest;
    }

    public PurchaseAmountDTO getPurchaseAmount(Long requestId) {
        Map<String, Object> result = purchaseRepository.findTotalAmountByRequestId(requestId);
        if (result == null || result.isEmpty()) {
            return new PurchaseAmountDTO(requestId, 0.0);
        }
        Long id = ((Number) result.get("requestId")).longValue();
        Double total = ((Number) result.get("totalAmount")).doubleValue();

        return new PurchaseAmountDTO(id, total);
    }


    public List<PurchaseInfoDTO> getPurchaseInfo() {
        List<Map<String, Object>> results = purchaseRepository.GetPurchaseInfo();

        Function<Object, LocalDate> toLocalDate = dateObj -> {
            if (dateObj == null) return null;
            if (dateObj instanceof Timestamp) {
                return ((Timestamp) dateObj).toLocalDateTime().toLocalDate();
            } else if (dateObj instanceof java.sql.Date) {
                return ((java.sql.Date) dateObj).toLocalDate();
            } else {
                return null;
            }
        };

        return results.stream()
                .collect(Collectors.groupingBy(m -> ((Number) m.get("requestId")).longValue()))
                .entrySet().stream()
                .map(entry -> {
                    Long requestId = entry.getKey();
                    List<Map<String, Object>> group = entry.getValue();
                    Map<String, Object> first = group.get(0);

                    String supplierName = (String) first.get("supplierName");
                    LocalDate requestDate = toLocalDate.apply(first.get("requestDate"));
                    String paymentStatus = (String) first.get("paymentStatus");
                    String requestStatus = (String) first.get("requestStatus");
                    LocalDate expectedDeliveryDate = toLocalDate.apply(first.get("expectedDeliveryDate"));

                    List<PurchaseInfoDTO.ProductQuantity> products = group.stream()
                            .map(m -> new PurchaseInfoDTO.ProductQuantity(
                                    (String) m.get("productName"),
                                    ((Number) m.get("quantity")).intValue()
                            ))
                            .collect(Collectors.toList());

                    return new PurchaseInfoDTO(
                            requestId,
                            supplierName,
                            requestDate,
                            paymentStatus,
                            requestStatus,
                            expectedDeliveryDate,
                            products
                    );
                })
                .collect(Collectors.toList());
    }



    public PurchaseRequest updateStatus(PurchaseStatusUpdateDTO dto) {
        PurchaseRequest request = purchaseRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Purchase Request not found with ID: " + dto.getRequestId()));

        request.setStatus(dto.getStatus());
        request.setUpdatedAt(LocalDateTime.now());


        return purchaseRepository.save(request);
    }



    public void deletePurchaseRequest(Long id) {
        PurchaseRequest request = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Request not found with ID: " + id));
        purchaseRepository.delete(request);

    }





    private LocalDate toLocalDate(Object dateObj) {
        if (dateObj == null) return null;
        if (dateObj instanceof Timestamp) {
            return ((Timestamp) dateObj).toLocalDateTime().toLocalDate();
        } else if (dateObj instanceof java.sql.Date) {
            return ((java.sql.Date) dateObj).toLocalDate();
        } else {
            return null; // or throw exception if unexpected type
        }
    }



    public String generateInvoiceNumber() {
        Long latest = supplierPaymentInvoiceRepository.findLatestInvoiceNumberForToday(LocalDate.now());
        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        int nextSequence = 0;
        System.out.println("Latest invoice number from DB: " + latest);
        if (latest != null) {
            String lastSeqStr = String.valueOf(latest).substring(8);
            System.out.println("Last sequence extracted: " + lastSeqStr);
            nextSequence = Integer.parseInt(lastSeqStr) + 1;
        }
        System.out.println("Next invoice number generated: " + datePrefix + String.format("%04d", nextSequence));

        // Format to YYYYMMDD + 4-digit sequence
        return datePrefix + String.format("%04d", nextSequence);
    }


    public SupplierPaymentInfoDTO getSupplierPaymentInfo(Long requestId) {
        List<Object[]> rows = supplierPaymentRepository.getSupplierPaymentRawRows(requestId);
        if (rows == null || rows.isEmpty()) {
            return null;
        }

        Object[] firstRow = rows.get(0);
        Long supplierId = ((Number) firstRow[0]).longValue();
        String supplierName = (String) firstRow[1];
        String status = (String) firstRow[2];

        List<SupplierPaymentInfoDTO.PaymentMethodDTO> paymentMethods = new ArrayList<>();

        for (Object[] row : rows) {
            if (row[3] != null) {
                Long paymentMethodId = ((Number) row[3]).longValue();
                String paymentType = (String) row[4];
                String bank = (String) row[5];
                String accountNumber = (String) row[6];
                byte[] qrImg = null;

                Object qrImgObj = row[7];
                if (qrImgObj != null) {
                    if (qrImgObj instanceof Blob) {
                        Blob blob = (Blob) qrImgObj;
                        try (InputStream is = blob.getBinaryStream()) {
                            qrImg = is.readAllBytes();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else if (qrImgObj instanceof byte[]) {
                        qrImg = (byte[]) qrImgObj;
                    }
                    // else handle other possible proxy types if needed
                }

                paymentMethods.add(new SupplierPaymentInfoDTO.PaymentMethodDTO(
                        paymentMethodId, paymentType, bank, accountNumber, qrImg));
            }
        }

        return new SupplierPaymentInfoDTO(supplierId, supplierName, status, paymentMethods);
    }


    public List<PurchaseItemProjection> getPurchaseItemsWithAttributes(Long requestId) {
        return purchaseItemRepository.findPurchaseItemsWithAttributes(requestId);
    }








}
