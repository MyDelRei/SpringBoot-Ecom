package org.project.ecom.model.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SkuAttributeDto {

    private Long skuId;
    private String skuCode;
    private String isSerialized;
    private String productName;
    private String description;
    private List<AttributeWithValue> attributes;

    // Add this to store image data (like base64 or URLs)
    private List<ImageDto> images;

    @Data
    @Builder
    public static class AttributeWithValue {
        private Long attributeId;
        private String attributeName;
        private String unitOfMeasure;
        private String attributeValue;
    }

    @Data
    @Builder
    public static class ImageDto {
        private String base64Image; // or URL if you serve images as files
        private String altText;
        private Integer displayOrder;
    }
}
