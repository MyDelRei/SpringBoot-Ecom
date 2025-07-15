package org.project.ecom.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Supplier {
    @Id
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
