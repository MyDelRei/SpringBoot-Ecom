package org.project.ecom.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierPaymentMethodResponseDTO {
    private Long id;
    private Long supplierId;
    private String supplierName;
    private String paymentType;
    private String bank;
    private String accountNumber;
    private String qrImgBase64;
}