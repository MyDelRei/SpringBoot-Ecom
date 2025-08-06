package org.project.ecom.model.dto;
import lombok.Data;


import java.util.List;

@Data
public class SkuAttributeRequest {

    private Long skuId;
    private List<attributes> attributes; // include attributeId + value


    @Data
    public static class attributes {
        private Long attributeId;
        private String value;
    }
}




