package org.project.ecom.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierProductRequestDto {
    private Long supplierId;
    private Long skuId;
    private Integer leadTimeDays;
    private BigDecimal costPrice;
    private String status;
}
