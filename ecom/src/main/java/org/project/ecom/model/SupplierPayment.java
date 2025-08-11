package org.project.ecom.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "SUPPLIER_PAYMENT")
public class SupplierPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENT_ID", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "SUPPLIER_ID")
    private Supplier supplier;

    @Column(name = "PAYMENT_DATE")
    private LocalDate paymentDate;

    @Column(name = "AMOUNT", precision = 18, scale = 2)
    private BigDecimal amount;

    @OneToOne(fetch = FetchType.EAGER) // Change from LAZY to EAGER
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "REQUEST_ID")
    private PurchaseRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "SPM_ID")
    private SupplierPaymentMethod spm;


    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "UPDATED_AT")
    private Instant updatedAt;

}