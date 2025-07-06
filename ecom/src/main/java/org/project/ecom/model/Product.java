package org.project.ecom.model;


import jakarta.persistence.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "Product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Product_Id")
    private Long productId;

    @Column(name = "Product_Name", nullable = false, unique = true, length = 450)
    private String productName;

    @ManyToOne
    @JoinColumn(name = "Brand_ID", nullable = false)
    private Brand brand;

    @Lob
    @Column(name = "Description")
    private String description;

    // Images are now managed separately; no cascade or orphanRemoval here.
    // They will be loaded when accessing product.getImages(), but not persisted/deleted
    // automatically when the Product entity is saved/deleted.
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Images> images;

    // Product Categories remain cascaded with the product
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<ProductCategory> productCategories;



}