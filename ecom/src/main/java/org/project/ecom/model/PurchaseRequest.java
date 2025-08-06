package org.project.ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "PURCHASE_REQUEST")
public class PurchaseRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REQUEST_ID", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "SUPPLIER_ID")
    private Supplier supplier;

    @Column(name = "REQUEST_DATE")
    private LocalDate requestDate;

    @Column(name = "EXPECTED_DELIVERY_DATE")
    private LocalDate expectedDeliveryDate;

    @Size(max = 255)
    @Column(name = "STATUS")
    private String status;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;


}