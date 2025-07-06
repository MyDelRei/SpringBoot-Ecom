package org.project.ecom.controller;

import org.project.ecom.model.*;
import org.project.ecom.model.dto.ImageDTO;
import org.project.ecom.model.dto.ProductListDTO;
import org.project.ecom.model.dto.ProductRequestDto;
import org.project.ecom.repository.ProductRepository;
import org.project.ecom.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/admin/product")
public class ProductController {

   private final ProductService productService;


   @Autowired
   public ProductController(ProductService productService, ProductRepository productRepository) {
      this.productService = productService;
   }

   // CREATE
   @PostMapping
   public ResponseEntity<Map<String, Object>> createProduct(@RequestBody ProductRequestDto dto) {
      try {
         Product product = productService.createProductFromDto(dto);
         Map<String, Object> response = new HashMap<>();
         response.put("message", "Add product success");
         response.put("productId", product.getProductId());
         return new ResponseEntity<>(response, HttpStatus.CREATED);
      } catch (Exception e) {
         return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
      }
   }


   // READ All (Kept as before, returning data)
   @GetMapping
   public ResponseEntity<List<ProductListDTO>> getAllProducts() {
      List<ProductListDTO> productDTOs = productService.getAllProductDTOs();
      return new ResponseEntity<>(productDTOs, HttpStatus.OK);
   }


   // READ by ID (Kept as before, returning data)
   @GetMapping("/{id}")
   public ResponseEntity<Product> getProductById(@PathVariable Long id) {
      return productService.getProductById(id)
              .map(product -> new ResponseEntity<>(product, HttpStatus.OK))
              .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   // UPDATE
   @PutMapping
   public ResponseEntity<String> updateProduct(@RequestBody Product productDetails) {
      if (productDetails.getProductId() == null) {
         return new ResponseEntity<>("Product ID is required for update", HttpStatus.BAD_REQUEST);
      }
      try {
         productService.updateProduct(productDetails.getProductId(), productDetails);
         return new ResponseEntity<>("Update product success", HttpStatus.OK);
      } catch (RuntimeException e) {
         // Log the exception for debugging
         return new ResponseEntity<>("Failed to update product: " + e.getMessage(), HttpStatus.NOT_FOUND);
      }
   }

   // DELETE
   @PostMapping("/delete")
   public ResponseEntity<String> deleteProduct(@RequestBody Map<String, Long> requestBody) {
      Long productId = requestBody.get("productId");
      if (productId == null) {
         return new ResponseEntity<>("Product ID is required for delete", HttpStatus.BAD_REQUEST);
      }
      try {
         productService.deleteProduct(productId);
         return new ResponseEntity<>("Delete product success", HttpStatus.OK);
      } catch (RuntimeException e) {
         // Log the exception for debugging
         return new ResponseEntity<>("Failed to delete product: " + e.getMessage(), HttpStatus.NOT_FOUND);
      }
   }







}