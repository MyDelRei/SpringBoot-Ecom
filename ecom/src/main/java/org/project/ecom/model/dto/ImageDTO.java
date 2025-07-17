package org.project.ecom.model.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ImageDTO {
    private Long imageId;
    private String altText;
    private Integer displayOrder;

    // Optionally base64 image
    private String imageBase64;

    // Getters and Setters
}