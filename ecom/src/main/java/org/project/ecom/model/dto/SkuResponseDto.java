package org.project.ecom.model.dto;

import lombok.*;
import java.math.*;
import java.time.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkuResponseDto {
    private Long skuId;
    private String skuCode;
    private String description;
    private Long productId;
    private String productName;
    private BigDecimal basePrice;
    private BigDecimal salePrice;
    private Character isSerialized;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}