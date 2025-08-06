package org.project.ecom.model.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierProductFlatDTO {
    private Long id;
    private String supplierName;
    private String email;
    private String phone;
    private String address;
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
