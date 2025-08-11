package org.project.ecom.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductItemArrivalDTO {
    @NotNull
    private Long skuId;
    private String skuCode;
    private String productName;
    @NotNull
    private Long quantityReceived;
    private String note;
}
