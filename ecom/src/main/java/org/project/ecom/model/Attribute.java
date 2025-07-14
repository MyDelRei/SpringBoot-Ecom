package org.project.ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.stereotype.Service;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "ATTRIBUTE")
public class Attribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ATTRIBUTE_ID")
    private Long attributeId;

    @Size(max = 255)
    @NotNull
    @Column(name = "ATTRIBUTE_NAME")
    private String attributeName;

    @Size(max = 450)
    @Column(name = "UNIT_OF_MEASURE", length = 450)
    private String unitOfMeasure;

    @Lob
    @Column(name = "DESCRIPTION")
    private String description;


}