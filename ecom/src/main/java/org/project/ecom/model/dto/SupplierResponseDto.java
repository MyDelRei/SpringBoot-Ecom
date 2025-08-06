package org.project.ecom.model.dto;

import lombok.*;
import org.project.ecom.model.Supplier;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierResponseDto {
    private Long id;
    private String supplierName;
    private String email;
    private String phone;
    private String address;

    public SupplierResponseDto(Supplier supplier) {
        this.id = supplier.getId();
        this.supplierName = supplier.getSupplierName();
        this.email = supplier.getEmail();
        this.phone = supplier.getPhone();
        this.address = supplier.getAddress();
    }
}
