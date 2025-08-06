package org.project.ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "SUPPLIER_PRODUCT")
public class SupplierProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPPLIER_PRODUCT_ID")
    private Long supplierProductId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "SUPPLIER_ID", nullable = false)
    private Supplier supplier;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "SKU_ID", nullable = false)
    private Sku sku;

    @Column(name = "LEAD_TIME_DAYS")
    private Long leadTimeDays;

    @Column(name = "COSTPRICE", precision = 18, scale = 2)
    private BigDecimal costPrice;

    @Size(max = 50)
    @Nationalized
    @Column(name = "STATUS", length = 50)
    private String status;




}