package org.project.ecom.model.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SupplierPaymentRequest {
    private Long supplierId;
    private String spm_Id;
    private BigDecimal amount;
    private String invoiceNumber;
    private Long requestId; // optional for future use
}