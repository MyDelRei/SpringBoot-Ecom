package org.project.ecom.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "Product_Category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PC_id")
    private Long pcId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Product_ID", nullable = false)
    @ToString.Exclude
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Category_ID", nullable = false)
    @ToString.Exclude
    private Category category;
}