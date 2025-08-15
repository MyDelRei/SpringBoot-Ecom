package org.project.ecom.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductArrivalDTO {
    @NotNull
    private Long id;
    @NotNull
    private Long requestId;

    private String requestStatus;

    private Long invoiceNumber;
    @NotNull
    private LocalDate arrivalDate;
    @NotNull
    private Long receivedById;
    private List<ProductItemArrivalDTO> items;
}
