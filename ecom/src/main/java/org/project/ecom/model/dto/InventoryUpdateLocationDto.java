package org.project.ecom.model.dto;


import lombok.Data;

@Data
public class InventoryUpdateLocationDto {
    private Long inventoryId;
    private Long currentLocationId;
}
