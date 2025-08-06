package org.project.ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "SKU_ATTRIBUTE")
public class SkuAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SKU_ATTRIBUTE_ID", nullable = false)
    private Long id;


    @Column(name = "GROUP_ID", nullable = false)
    private Long groupId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "SKU_ID", nullable = false)
    private Sku sku;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ATTRIBUTE_ID", nullable = false)
    private Attribute attribute;

    @Size(max = 450)
    @NotNull
    @Column(name = "ATTRIBUTE_VALUE", nullable = false, length = 450)
    private String attributeValue;

}