package org.project.ecom.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PurchaseStatusUpdateDTO {
    private Long requestId;
    private String status;
}