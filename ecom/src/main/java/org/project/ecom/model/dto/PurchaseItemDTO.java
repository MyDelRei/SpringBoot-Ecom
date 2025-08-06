package org.project.ecom.model.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class PurchaseItemDTO {
    private Long requestItemId;
    private Long requestId;
    private Integer quantity;
    private Double totalBasePrice;
    private Double basePrice;
    private Long productId;
    private String productName;
    private String attributes;
}
