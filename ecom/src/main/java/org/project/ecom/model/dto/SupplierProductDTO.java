package org.project.ecom.model.dto;


import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierProductDTO {
    private Long id; // supplier id
    private String supplierName;
    private String email;
    private String phone;
    private String address;

    // This is the list of products for the supplier
    private List<ProductInfo> products;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductInfo {
        private Long supplierProductId;
        private Long leadTimeDays;
        private BigDecimal costPrice;
        private String status;
        private Long skuId;
        private String skuCode;
        private String skuDescription;
        private Long productId;
        private String productName;
    }
}
