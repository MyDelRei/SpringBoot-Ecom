package org.project.ecom.model.dto;

import jakarta.validation.constraints.*;
import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class IndividualUnitDto {
    @NotNull
    private Long skuId;

    @NotNull
    private Long arrivalId;

    @Size(max = 450)
    private String serialNumber;

    @NotNull
    private Long currentLocationId;
}
