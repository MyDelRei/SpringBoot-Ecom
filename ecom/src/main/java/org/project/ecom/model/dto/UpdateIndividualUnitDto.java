package org.project.ecom.model.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateIndividualUnitDto {

    @NotNull
    private String serialNumber;

    @NotNull
    private Long locationId;
}
