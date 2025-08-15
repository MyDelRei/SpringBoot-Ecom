package org.project.ecom.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class SupplierPurchaseDetailsDTO {
    private Long requestId;
    private Long supplierId;
    private String supplierName;
    private String invoiceNumber;
    private BigDecimal amount;
    private String requestStatus;
    private String paymentMethod;
    private LocalDate paymentDate;
    private List<SkuDetail> skuDetails;


    @Data
    @AllArgsConstructor
    public static class SkuDetail {
        private String skuCode;
        private String productName;
        private Integer quantityRequested;
        private BigDecimal price;
    }
}
