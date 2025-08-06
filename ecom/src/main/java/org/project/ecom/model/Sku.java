package org.project.ecom.model;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "SKU")
public class Sku {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SKU_ID")
    private Long skuId;

    @Column(name = "SKU_CODE", nullable = false, length = 100)
    private String skuCode;

    @Lob
    @Column(name = "DESCRIPTION")
    private String description;

    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @Column(name = "BASE_PRICE", precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "SALE_PRICE", precision = 12, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "IS_SERIALIZED", length = 1)
    private Character isSerialized;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isSerialized == null) {
            isSerialized = 'N';
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
