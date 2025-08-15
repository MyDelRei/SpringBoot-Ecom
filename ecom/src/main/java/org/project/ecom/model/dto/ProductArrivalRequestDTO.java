package org.project.ecom.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductArrivalRequestDTO {
    @NotNull
    private Long requestId;
    @NotNull
    private Long invoiceNumber;
    @NotNull
    private LocalDate arrivalDate;
    @NotNull
    private Long receivedById;
    @NotEmpty
    private List<ProductItemArrivalRequestDTO> items;
}

