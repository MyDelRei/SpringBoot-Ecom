package org.project.ecom.model.dto;

public interface InventorySkuDetailProjection {
    Long getInventoryId();
    String getProductName();
    Long getSkuId();
    String getSkuCode();
    Integer getQuantityStored();
    String getCurrentLocation();
}
