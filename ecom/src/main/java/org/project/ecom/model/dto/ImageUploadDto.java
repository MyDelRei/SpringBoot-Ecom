package org.project.ecom.model.dto;


import java.util.List;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ImageUploadDto {

    private Long productId;
    private List<ImageDTO> images;

}
