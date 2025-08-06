package org.project.ecom.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.project.ecom.model.dto.SkuAttributeDto;
import org.project.ecom.model.dto.SkuAttributeRequest;
import org.project.ecom.model.dto.SkuAttributeResponseDto;

import org.project.ecom.service.SkuAttributeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/sku-attributes")
@RequiredArgsConstructor
public class SkuAttributeController {

   private final SkuAttributeService skuAttributeService;

   //  Create multiple sku-attribute groups
   @PostMapping("/create")
   public ResponseEntity<String> createSkuAttributes(@RequestBody SkuAttributeRequest request) {
       try {
           skuAttributeService.createSkuAttributes(Collections.singletonList(request));
           return ResponseEntity.ok("SKU attributes saved successfully");
       } catch (Exception e) {
           return ResponseEntity.badRequest()
                   .body("Failed to save SKU attributes: " + e.getMessage());
       }
   }


    //  Get all grouped sku-attributes
   @GetMapping
   public ResponseEntity<List<SkuAttributeResponseDto>> getAllSkuAttributes() {
      return ResponseEntity.ok(skuAttributeService.getAllSkuAttributes());
   }


   //  Update a specific group
   @PutMapping("/{skuAttributeId}")
   public ResponseEntity<String> updateSkuAttribute(@PathVariable Long skuAttributeId,
                                                         @RequestBody SkuAttributeRequest request) {
      skuAttributeService.updateSkuAttribute(skuAttributeId, request);
      return ResponseEntity.ok("SKU Attribute group updated successfully");
   }

   //  Delete a group
   @DeleteMapping("/{skuAttributeId}")
   public ResponseEntity<String> deleteSkuAttribute(@PathVariable Long skuAttributeId) {
      skuAttributeService.deleteSkuAttribute(skuAttributeId);
      return ResponseEntity.ok("SKU Attribute group deleted successfully");
   }

    @GetMapping("/with-details")
    public ResponseEntity<List<SkuAttributeDto>> getAllSkuAttributesWithDetails() {
        return ResponseEntity.ok(skuAttributeService.getAllSkuAttributesDetailed());
    }

    @Data
    public static class RemoveAttributeRequest {
        private Long skuId;
        private Long attributeId;
    }

    @DeleteMapping("/delete-attribute")
    public ResponseEntity<String> deleteAttributeFromSku(@RequestBody RemoveAttributeRequest request) {
        boolean removed = skuAttributeService.removeAttributeFromSku(request.getSkuId(), request.getAttributeId());

        if (removed) {
            return ResponseEntity.ok("Attribute removed from SKU");
        } else {
            return ResponseEntity.status(404).body("Attribute or SKU not found");
        }
    }





}
