package org.project.ecom.model;

import jakarta.persistence.*;
import lombok.*;
import org.project.ecom.model.Warehouse;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "LOCATION")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOCATION_ID")
    private Long locationId;

    @ManyToOne
    @JoinColumn(name = "WAREHOUSE_ID", nullable = false)
    private Warehouse warehouse;

    @Column(name = "SECTION", length = 50)
    private String section;

    @Column(name = "AISLE", length = 50)
    private String aisle;

    @Column(name = "BIN")
    private Integer bin;

    @Column(name = "NOTE", length = 50)
    private String note;
}
