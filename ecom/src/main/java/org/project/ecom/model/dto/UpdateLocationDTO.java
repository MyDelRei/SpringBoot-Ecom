package org.project.ecom.model.dto;


import lombok.Data;

@Data
public class UpdateLocationDTO {
    private Long locationId;
    private String section;
    private String aisle;
    private String bin;
    private String note;
}
