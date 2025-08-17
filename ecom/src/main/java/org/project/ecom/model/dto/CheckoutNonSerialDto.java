package org.project.ecom.model.dto;


import lombok.Data;

@Data
public class CheckoutNonSerialDto {
    private String sku;
    private Long quantity;
}
