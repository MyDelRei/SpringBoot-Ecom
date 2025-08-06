package org.project.ecom.model.dto;

import lombok.Data;

@Data
public class GetLocation {
    private Long locationId;
    private String warehouse;
    private String section;
    private String aisle;
    private String bin;
    private String note;
}
