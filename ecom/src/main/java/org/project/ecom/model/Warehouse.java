package org.project.ecom.model;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "WAREHOUSE")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WAREHOUSE_ID")
    private Long warehouseId;

    @Column(name = "warehouse_name")
    private String warehouseName;

    @Column(name = "location")
    private String location;

    @Column(name = "description")
    private String description;


}
