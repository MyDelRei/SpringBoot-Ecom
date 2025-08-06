package org.project.ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "LOCATION")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOCATION_ID", nullable = false)
    private Long locationId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "WAREHOUSE_ID", nullable = false)
    private Warehouse warehouse;

    @Size(max = 255)
    @Column(name = "SECTION")
    private String section;

    @Size(max = 255)
    @Column(name = "AISLE")
    private String aisle;

    @Size(max = 255)
    @Column(name = "BIN")
    private String bin;

    @Size(max = 255)
    @Column(name = "NOTE")
    private String note;

}