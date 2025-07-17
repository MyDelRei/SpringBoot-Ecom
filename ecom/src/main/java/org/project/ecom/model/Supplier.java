package org.project.ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "SUPPLIER")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPPLIER_ID", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "SUPPLIER_NAME", nullable = false)
    private String supplierName;

    @Size(max = 255)
    @NotNull
    @Column(name = "EMAIL", nullable = false)
    private String email;

    @Size(max = 255)
    @NotNull
    @Column(name = "PHONE", nullable = false)
    private String phone;

    @NotNull
    @Lob
    @Column(name = "ADDRESS", nullable = false)
    private String address;

}