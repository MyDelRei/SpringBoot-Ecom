package org.project.ecom.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseAmountDTO {
    private Long requestId;
    private Double totalAmount;
}
