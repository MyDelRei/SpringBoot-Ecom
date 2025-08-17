package org.project.ecom.model.dto;

import java.time.LocalDateTime;


public interface RecentCheckoutProjection {
    Long getCheckoutId();
    String getSku();
    Integer getQuantity();
    String getSerialNumber(); // nullable for non-serial
    LocalDateTime getCreatedAt();
    String getType(); // 'serial' or 'non-serial'
}
