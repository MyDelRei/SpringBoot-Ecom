package org.project.ecom.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

/**
 * Data Transfer Object for Sku creation and update requests.
 * This simplifies the incoming JSON payload by accepting productId directly.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkuRequestDTO {
    private Long skuId; // For updates, if provided
    private String skuCode;
    private String description;
    private Long productId; // This will hold the ID of the associated Product
    private BigDecimal salePrice;
    private Character isSerialized;
}
