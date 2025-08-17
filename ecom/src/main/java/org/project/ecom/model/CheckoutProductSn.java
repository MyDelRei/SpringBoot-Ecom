package org.project.ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "CHECKOUT_PRODUCT_SN")
public class CheckoutProductSn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHECKOUT_ID", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "SKU", nullable = false)
    private String sku;

    @Size(max = 450)
    @NotNull
    @Column(name = "SERIAL_NUMBER", nullable = false, length = 450)
    private String serialNumber;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "CREATED_AT")
    private OffsetDateTime createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "UPDATED_AT")
    private OffsetDateTime updatedAt;

}