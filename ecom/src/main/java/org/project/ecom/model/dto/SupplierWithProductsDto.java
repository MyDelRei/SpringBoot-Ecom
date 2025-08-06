package org.project.ecom.model.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SupplierWithProductsDto {

    private Long supplierId;
    private String supplierName;
    private String email;
    private String phone;
    private String address;

    private List<SkuDto> skus;

    // --- Inner SKU DTO ---
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SkuDto {
        private Long skuId;
        private String skuCode;
        private BigDecimal basePrice;
        private BigDecimal salePrice;
        private String isSerialized;

        private ProductDto product;
        private List<AttributeDto> attributes;
    }

    // --- Inner Product DTO ---
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductDto {
        private Long productId;
        private String productName;
    }

    // --- Inner Attribute DTO ---
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AttributeDto {
        private Long attributeId;
        private String attributeName;
        private String unitOfMeasure;
        private String attributeValue;
    }
}
