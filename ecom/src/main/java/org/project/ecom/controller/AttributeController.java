package org.project.ecom.controller;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.project.ecom.model.Attribute;
import org.project.ecom.service.AttributeService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AttributeController {

   private final AttributeService attributeService;

   // get all attributes
   @GetMapping("/attributes")
   public ResponseEntity<List<Attribute>> getAllAttributes() {
      return ResponseEntity.ok(attributeService.getAllAttributes());
   }

   // get attribute by id
   @GetMapping("/attributes/{attributeId}")
   public ResponseEntity<Attribute> getAttributeById(Long id){
      return ResponseEntity.ok(attributeService.getAttributeById(id));
   }

   // create attribute
   @PostMapping("/attributes")
   public ResponseEntity<?> createAttribute(@RequestBody @Valid Attribute model, BindingResult bindingResult){
      if(bindingResult.hasErrors()){
         return ResponseEntity.badRequest().body(null);
      }
      attributeService.createAttribute(model);
      return ResponseEntity.ok("Brand created successfully");
   }

   // Update attribute
   @PutMapping("/attributes")
   public ResponseEntity<?> updateAttribute(@RequestBody @Valid Attribute model, BindingResult bindingResult){
      if(bindingResult.hasErrors()){
         return ResponseEntity.badRequest().body("Validation failed");
      }
      attributeService.updateAttribute(model);
      return ResponseEntity.ok("Attribute updated successfully");
   }

   // delete att
   @PostMapping("/delete-attributes")
   public ResponseEntity<?> deleteAttribute(@RequestBody @Valid Attribute model, BindingResult bindingResult){
      if(bindingResult.hasErrors()){
         ResponseEntity.badRequest().body(null);
      }
      attributeService.deleteAttribute(model);
      return ResponseEntity.ok("Attribute deleted successfully");
   }
}
