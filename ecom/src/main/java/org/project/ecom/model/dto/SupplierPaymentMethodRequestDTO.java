package org.project.ecom.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierPaymentMethodRequestDTO {
    private Long supplierId;
    private String paymentType;
    private String bank;
    private String accountNumber;
    private byte[] qrImg;

}
