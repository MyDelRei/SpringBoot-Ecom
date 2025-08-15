package org.project.ecom.model.dto;

import java.time.LocalDate;


public interface ArrivalSkuDetailsDTO {
    Long getSkuId();
    String getSkuCode();
    Integer getQuantityReceived();
    LocalDate getArrivalDate();
}
