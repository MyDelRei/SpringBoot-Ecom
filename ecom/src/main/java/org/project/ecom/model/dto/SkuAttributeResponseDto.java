package org.project.ecom.model.dto;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SkuAttributeResponseDto {
    private Long groupId;
    private List<SkuResponseDto> skus;
    private List<AttributeWithValue> attributes;

    @Data
    @Builder
    public static class AttributeWithValue {
        private Long attributeId;
        private String attributeName;
        private String unitOfMeasure;
        private String attributeValue;
    }
}
