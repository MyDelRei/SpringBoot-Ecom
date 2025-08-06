package org.project.ecom.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Images {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Image_ID")
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Product_ID", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Product product;

    @Lob
    @Column(name = "Image", columnDefinition = "BLOB")
    private byte[] imageBytes;

    @Column(name = "Alt_Text", length = 100)
    private String altText;

    @Column(name = "Display_Order")
    private Integer displayOrder;
}