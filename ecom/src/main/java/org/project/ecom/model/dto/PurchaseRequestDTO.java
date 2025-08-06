package org.project.ecom.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;
import java.time.LocalDate;

@Data
public class PurchaseRequestDTO {

    @NotNull
    private Long supplierId;

    @NotNull
    private LocalDate requestDate;

    @NotNull
    private LocalDate expectedDeliveryDate;

    @NotBlank
    private String status;

    @NotEmpty
    private List<PurchaseItemDTO> items;

    @Data
    public static class PurchaseItemDTO {
        @NotNull
        private Long skuId;

        @NotNull
        private Long quantityRequest;
    }
}
