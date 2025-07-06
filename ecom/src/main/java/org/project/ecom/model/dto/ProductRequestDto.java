package org.project.ecom.model.dto;

import java.util.List;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductRequestDto {
    private String productName;
    private String brandName;          // just name, not full Brand entity
    private String description;
    private List<String> categoryNames; // just names for categories
    // getters and setters
}

