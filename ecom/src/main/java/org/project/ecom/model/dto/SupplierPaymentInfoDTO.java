package org.project.ecom.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPaymentInfoDTO {
    private Long supplierId;
    private String supplierName;
    private String status;
    private List<PaymentMethodDTO> paymentMethods;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMethodDTO {
        private Long paymentMethodId;
        private String paymentType;
        private String bank;
        private String accountNumber;
        private byte[] qrImg; // BLOB as byte[]
    }
}
