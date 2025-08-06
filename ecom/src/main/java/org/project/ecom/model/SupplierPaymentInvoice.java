package org.project.ecom.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "SUPPLIER_PAYMENT_INVOICE")
public class SupplierPaymentInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENT_INVOICE_ID", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "PAYMENT_ID")
    private SupplierPayment payment;

    @Column(name = "INVOICE_NUMBER")
    private Long invoiceNumber;

    @Column(name = "INVOICE_DATE")
    private LocalDate invoiceDate;


    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "UPDATED_AT")
    private Instant updatedAt;

}