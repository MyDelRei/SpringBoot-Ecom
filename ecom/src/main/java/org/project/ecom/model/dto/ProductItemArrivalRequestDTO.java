package org.project.ecom.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductItemArrivalRequestDTO {
    @NotNull
    private Long skuId;
    @NotNull
    @Min(1)
    private Long quantityReceived;
    private String note;
}