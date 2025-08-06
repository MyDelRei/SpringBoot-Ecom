package org.project.ecom.service;

import lombok.RequiredArgsConstructor;
import org.project.ecom.model.Product;
import org.project.ecom.model.dto.SkuAttributeDto;
import org.project.ecom.model.dto.SkuAttributeRequest;
import org.project.ecom.model.dto.SkuAttributeResponseDto;

import org.project.ecom.model.Attribute;
import org.project.ecom.model.Sku;
import org.project.ecom.model.SkuAttribute;
import org.project.ecom.model.dto.SkuResponseDto;
import org.project.ecom.repository.AttributeRepository;
import org.project.ecom.repository.SkuAttributeRepository;
import org.project.ecom.repository.SkuRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
@RequiredArgsConstructor
public class SkuAttributeService {

    private final SkuAttributeRepository skuAttributeRepository;
    private final AttributeRepository attributeRepository;
    private final SkuRepository skuRepository;



    ///**********************************************
    ///Creates multiple SkuAttributes based on a list
    ///of SkuAttributeRequest objects, associating SKUs
    ///with attributes and saving them to the repository
    // public void createSkuAttributes(List<SkuAttributeRequest> requestList) {
    //     for (SkuAttributeRequest request : requestList) {
    //         List<Long> skuIds = request.getSkus().stream().map(SkuAttributeRequest.skus::getSkuId).toList();
    //         List<Long> attributeIds = request.getAttributes().stream().map(SkuAttributeRequest.attributes::getAttributeId).toList();

    //         Map<Long, Sku> skuMap = skuRepository.findAllById(skuIds).stream()
    //                 .collect(Collectors.toMap(Sku::getSkuId, sku -> sku));
    //         Map<Long, Attribute> attributeMap = StreamSupport.stream(
    //                         attributeRepository.findAllById(attributeIds).spliterator(), false)
    //                 .filter(attr -> attr.getAttributeId() != null) // Prevent null keys in the map
    //                 .collect(Collectors.toMap(Attribute::getAttributeId, attr -> attr));

    //         List<SkuAttribute> skuAttributes = new ArrayList<>();

    //         for (SkuAttributeRequest.skus sku : request.getSkus()) {
    //             for (SkuAttributeRequest.attributes attr : request.getAttributes()) {
    //                 SkuAttribute sa = new SkuAttribute();
    //                 sa.setGroupId(request.getGroupId());
    //                 sa.setSku(skuMap.get(sku.getSkuId()));
    //                 sa.setAttribute(attributeMap.get(attr.getAttributeId()));
    //                 sa.setAttributeValue(sa.getAttributeValue());
    //                 skuAttributes.add(sa);
    //             }
    //         }

    //         skuAttributeRepository.saveAll(skuAttributes);
    //     }
    // }
    public void createSkuAttributes(List<SkuAttributeRequest> requestList) {
    for (SkuAttributeRequest request : requestList) {
        // Validate groupId

        // Validate skuId
        if (request.getSkuId() == null) {
            throw new IllegalArgumentException("SKU ID must not be null");
        }

        // Validate attributes list
        if (request.getAttributes() == null || request.getAttributes().isEmpty()) {
            throw new IllegalArgumentException("Attributes list must not be empty");
        }

        // Load the SKU
        Sku sku = skuRepository.findById(request.getSkuId())
                .orElseThrow(() -> new RuntimeException("SKU not found: " + request.getSkuId()));

        // Extract attribute IDs
        List<Long> attributeIds = request.getAttributes().stream()
                .map(SkuAttributeRequest.attributes::getAttributeId)
                .collect(Collectors.toList());

        // Load all attributes from the DB
        Map<Long, Attribute> attributeMap = StreamSupport.stream(
                        attributeRepository.findAllById(attributeIds).spliterator(), false)
                .filter(attr -> attr.getAttributeId() != null)
                .collect(Collectors.toMap(Attribute::getAttributeId, attr -> attr));

        // Create SkuAttribute list
        List<SkuAttribute> skuAttributes = new ArrayList<>();
        for (SkuAttributeRequest.attributes attrReq : request.getAttributes()) {
            Attribute attribute = attributeMap.get(attrReq.getAttributeId());
            if (attribute == null) {
                throw new RuntimeException("Attribute not found: " + attrReq.getAttributeId());
            }

            SkuAttribute skuAttribute = new SkuAttribute();
    
            skuAttribute.setSku(sku);
            skuAttribute.setAttribute(attribute);
            skuAttribute.setAttributeValue(attrReq.getValue());

            skuAttributes.add(skuAttribute);
        }

        // Save all
        skuAttributeRepository.saveAll(skuAttributes);
    }
}


    ///***************************************************
    ///GET all SKU Attributes grouped by SKU
    ///Retrieves all SkuAttributes, groups
    ///them by groupId, and transforms
    ///into SkuAttributeResponseDto objects
    ///containing groupId, unique SKUs, and their attribute
    public List<SkuAttributeResponseDto> getAllSkuAttributes() {
        List<SkuAttribute> all = skuAttributeRepository.findAll();
        Map<Long, List<SkuAttribute>> grouped = all.stream()
                .collect(Collectors.groupingBy(SkuAttribute::getGroupId));

        List<SkuAttributeResponseDto> response = new ArrayList<>();

        for (Map.Entry<Long, List<SkuAttribute>> entry : grouped.entrySet()) {
            Long groupId = entry.getKey();
            List<SkuAttribute> groupItems = entry.getValue();

            List<SkuResponseDto> skuDtos = groupItems.stream()
                    .map(SkuAttribute::getSku)
                    .distinct()
                    .map(sku -> SkuResponseDto.builder()
                            .skuId(sku.getSkuId())
                            .skuCode(sku.getSkuCode())
                            .description(sku.getDescription())
                            .basePrice(sku.getBasePrice())
                            .salePrice(sku.getSalePrice())
                            .productId(sku.getProduct().getProductId())
                            .productName(sku.getProduct().getProductName())
                            .isSerialized(sku.getIsSerialized())
                            .createdAt(sku.getCreatedAt())
                            .updatedAt(sku.getUpdatedAt())
                            .build()
                    ).toList();

            List<SkuAttributeResponseDto.AttributeWithValue> attrDtos = groupItems.stream()
                    .map(sa -> SkuAttributeResponseDto.AttributeWithValue.builder()
                            .attributeId(sa.getAttribute().getAttributeId())
                            .attributeName(sa.getAttribute().getAttributeName())
                            .unitOfMeasure(sa.getAttribute().getUnitOfMeasure())
                            .attributeValue(sa.getAttributeValue())
                            .build())
                    .toList();

            response.add(SkuAttributeResponseDto.builder()
                    .groupId(groupId)
                    .skus(skuDtos)
                    .attributes(attrDtos)
                    .build());
        }

        return response;
    }


    // UPDATE
    public void updateSkuAttribute(Long skuAttributeId, SkuAttributeRequest request) {
        SkuAttribute skuAttribute = skuAttributeRepository.findById(skuAttributeId)
                .orElseThrow(() -> new RuntimeException("SKU Attribute not found with id: " + skuAttributeId));

        // Update fields
        if (request.getSkuId() != null) {
            Sku sku = skuRepository.findById(request.getSkuId())
                    .orElseThrow(() -> new RuntimeException("SKU not found: " + request.getSkuId()));
            skuAttribute.setSku(sku);
        }

        if (request.getAttributes() != null && !request.getAttributes().isEmpty()) {
            // Assuming only one attribute per SkuAttribute (or handle accordingly)
            SkuAttributeRequest.attributes attrReq = request.getAttributes().get(0);
            Attribute attribute = attributeRepository.findById(attrReq.getAttributeId())
                    .orElseThrow(() -> new RuntimeException("Attribute not found: " + attrReq.getAttributeId()));

            skuAttribute.setAttribute(attribute);
            skuAttribute.setAttributeValue(attrReq.getValue());
        }

        skuAttributeRepository.save(skuAttribute);
    }


    // DELETE

    public void deleteSkuAttribute(Long skuAttributeId) {
        if (!skuAttributeRepository.existsById(skuAttributeId)) {
            throw new RuntimeException("SKU Attribute not found with id: " + skuAttributeId);
        }
        skuAttributeRepository.deleteById(skuAttributeId);
    }

    public List<SkuAttributeDto> getAllSkuAttributesDetailed() {
        List<SkuAttribute> all = skuAttributeRepository.findAll();

        // Group by SKU to avoid duplication
        Map<Long, List<SkuAttribute>> groupedBySku = all.stream()
                .collect(Collectors.groupingBy(skuAttr -> skuAttr.getSku().getSkuId()));

        List<SkuAttributeDto> detailedDtos = new ArrayList<>();

        for (Map.Entry<Long, List<SkuAttribute>> entry : groupedBySku.entrySet()) {
            List<SkuAttribute> skuAttributes = entry.getValue();
            Sku sku = skuAttributes.get(0).getSku(); // All entries in group share same SKU
            Product product = sku.getProduct();

            // Map attributes
            List<SkuAttributeDto.AttributeWithValue> attributeDtos = skuAttributes.stream()
                    .map(sa -> SkuAttributeDto.AttributeWithValue.builder()
                            .attributeId(sa.getAttribute().getAttributeId())
                            .attributeName(sa.getAttribute().getAttributeName())
                            .unitOfMeasure(sa.getAttribute().getUnitOfMeasure())
                            .attributeValue(sa.getAttributeValue())
                            .build())
                    .collect(Collectors.toList());

            // Map images
            List<SkuAttributeDto.ImageDto> imageDtos = product.getImages().stream()
                    .map(image -> SkuAttributeDto.ImageDto.builder()
                            .base64Image(Base64.getEncoder().encodeToString(image.getImageBytes()))
                            .altText(image.getAltText())
                            .displayOrder(image.getDisplayOrder())
                            .build())
                    .collect(Collectors.toList());

            // Final DTO
            SkuAttributeDto dto = SkuAttributeDto.builder()
                    .skuId(sku.getSkuId())
                    .skuCode(sku.getSkuCode())
                    .isSerialized(String.valueOf(sku.getIsSerialized()))
                    .productName(product.getProductName())
                    .description(product.getDescription())
                    .attributes(attributeDtos)
                    .images(imageDtos)
                    .build();

            detailedDtos.add(dto);
        }

        return detailedDtos;
    }


    public SkuAttributeDto removeAttributeBySkuAndAttributeId(
            SkuAttributeDto dto, Long targetSkuId, Long targetAttributeId) {

        // Check SKU match
        if (!dto.getSkuId().equals(targetSkuId)) {
            return dto; // No change if SKU ID doesn't match
        }

        // Remove attribute
        List<SkuAttributeDto.AttributeWithValue> updatedAttributes = dto.getAttributes()
                .stream()
                .filter(attr -> !attr.getAttributeId().equals(targetAttributeId))
                .toList();

        // Return a new DTO with updated attributes (or update original)
        return SkuAttributeDto.builder()
                .skuId(dto.getSkuId())
                .skuCode(dto.getSkuCode())
                .isSerialized(dto.getIsSerialized())
                .productName(dto.getProductName())
                .description(dto.getDescription())
                .images(dto.getImages())
                .attributes(updatedAttributes)
                .build();
    }

    public boolean removeAttributeFromSku(Long skuId, Long attributeId) {
        // Find the SkuAttribute entity by sku and attribute IDs
        Optional<SkuAttribute> skuAttributeOpt = skuAttributeRepository.findBySku_SkuIdAndAttribute_AttributeId(skuId, attributeId);

        if (skuAttributeOpt.isEmpty()) {
            return false; // Not found
        }

        skuAttributeRepository.delete(skuAttributeOpt.get());
        return true;
    }











}
