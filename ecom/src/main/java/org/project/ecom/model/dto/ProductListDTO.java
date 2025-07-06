package org.project.ecom.model.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductListDTO {
    private Long productId;
    private String productName;
    private String description;
    private String brandName;
    private String categoryName;
    private List<ImageDTO> images;

    // Getters and Setters
}
