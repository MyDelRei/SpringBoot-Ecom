package org.project.ecom.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseInfoDTO {
    private Long requestId;
    private String supplierName;
    private LocalDate requestDate;
    private String paymentStatus;
    private String requestStatus;
    private LocalDate expectedDeliveryDate;
    private List<ProductQuantity> products;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductQuantity {
        private String productName;
        private int quantity;
    }
}
