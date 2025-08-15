package org.project.ecom.model.dto;

import java.util.Date;

public interface ArrivalSkuNotSerializeDto {
    Long getSkuId();
    Long getArrivalId();
    String getSkuCode();
    Date getArrivalDate();
    Integer getQuantityReceived();
}
