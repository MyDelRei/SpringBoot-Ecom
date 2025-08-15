package org.project.ecom.model.dto;

import java.math.BigDecimal;

public interface InventoryViewProjection {
    String getBrandName();
    String getProductName();
    String getCategories();
    String getSkuCode();
    String getSkuDescription();
    BigDecimal getBasePrice();
    BigDecimal getSalePrice();
    Character getIsSerialized();
    Long getLocationId();
    String getLocationPath();
    String getLocationNote();
    Integer getIndividualQuantity();
    Integer getInventoryQuantity();
    Integer getTotalQuantity();
}
