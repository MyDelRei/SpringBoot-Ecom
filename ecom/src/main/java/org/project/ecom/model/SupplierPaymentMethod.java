package org.project.ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "SUPPLIER_PAYMENT_METHOD")
public class SupplierPaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SPM_ID", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "SUPPLIER_ID", nullable = false)
    private Supplier supplier;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "payment_type", length = 100)
    private String paymentType;


    @Size(max = 100)
    @Nationalized
    @Column(name = "BANK", length = 100)
    private String bank;

    @Size(max = 100)
    @Nationalized
    @Column(name = "ACCOUNT_NUMBER", length = 100)
    private String accountNumber;

    @Column(name = "QR_IMG")
    private byte[] qrImg;

}