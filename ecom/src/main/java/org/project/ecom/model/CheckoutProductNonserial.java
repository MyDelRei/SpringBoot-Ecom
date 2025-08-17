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
@Table(name = "CHECKOUT_PRODUCT_NONSERIAL")
public class CheckoutProductNonserial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHECKOUT_ID", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "SKU", nullable = false)
    private String sku;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "QUANTITY", nullable = false)
    private Long quantity;


}