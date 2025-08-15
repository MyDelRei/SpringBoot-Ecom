package org.project.ecom.model.dto;

public interface PurchaseItemProjection {
    Long getRequestItemId();
    Long getRequestId();
    Integer getQuantity();
    Double getTotalBasePrice();
    Double getBasePrice();
    Long getProductId();
    String getProductName();
    String getAttributeName();
    String getAttributeValue();
    Long getSkuId();
}
