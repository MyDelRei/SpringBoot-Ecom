package org.project.ecom.model.dto;


import lombok.Data;

@Data
public class CreateInventoryDto {
    private Long arrivalId;
    private Long skuId;
    private Long quantityStored;
    private Long currentLocationId;
}
