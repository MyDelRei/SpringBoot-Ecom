package org.project.ecom.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.ecom.model.Images;
import org.project.ecom.model.dto.ImageDTO;
import org.project.ecom.model.dto.ImageUploadDto;
import org.project.ecom.service.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
public class ImagesController {

   private final ImagesService imageService;

   @Autowired
   public ImagesController(ImagesService imageService) {
      this.imageService = imageService;
   }


   @PostMapping
   public ResponseEntity<List<Images>> createImages(@RequestBody ImageUploadDto dto) {
      try {
         List<Images> createdImages = imageService.createImages(dto);
         return new ResponseEntity<>(createdImages, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }
   }


   // --- Bulk Create ---
   @PostMapping("/bluk")
   public ResponseEntity<List<Images>> createImages(@RequestBody Map<String, Object> requestBody) {
      Long productId = ((Number) requestBody.get("productId")).longValue();
      List<Map<String, Object>> imagesData = (List<Map<String, Object>>) requestBody.get("images");

      List<Images> images = new ArrayList<>();
      for (Map<String, Object> item : imagesData) {
         images.add(mapToImage((ImageDTO) item));
      }

      try {
         List<Images> createdImages = imageService.createImages(productId, images);
         return new ResponseEntity<>(createdImages, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }
   }

   // --- Bulk Update ---
   @PutMapping
   public ResponseEntity<List<Images>> updateImages(@RequestBody ImageUploadDto request) {
      Long productId = request.getProductId();
      List<ImageDTO> imageDTOs = request.getImages();

      if (productId == null || imageDTOs == null) {
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }

      List<Images> imageList = imageDTOs.stream().map(dto -> {
         Images img = mapToImage(dto);
         img.setImageId(dto.getImageId());
         return img;
      }).collect(Collectors.toList());

      List<Images> updatedImages = imageService.updateImages(productId, imageList);
      return new ResponseEntity<>(updatedImages, HttpStatus.OK);
   }





   // --- Get Image Entity ---
   @GetMapping("/{id}")
   public ResponseEntity<Images> getImageById(@PathVariable Long id) {
      return imageService.getImageById(id)
              .map(image -> new ResponseEntity<>(image, HttpStatus.OK))
              .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   // --- Get Raw Image Bytes for Display ---
   @GetMapping("/get/{id}")
   public ResponseEntity<byte[]> getImageData(@PathVariable Long id) {
      return imageService.getImageById(id)
              .map(image -> {
                 byte[] imageBytes = image.getImageBytes();
                 HttpHeaders headers = new HttpHeaders();
                 headers.setContentType(MediaType.IMAGE_JPEG); // adjust if needed
                 return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
              })
              .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   // --- Get All Images for a Product ---
   @GetMapping("/product/{productId}")
   public ResponseEntity<List<Images>> getImagesByProductId(@PathVariable Long productId) {
      List<Images> images = imageService.getImagesByProductId(productId);
      return new ResponseEntity<>(images, HttpStatus.OK);
   }

   // --- Delete Single Image ---
   @DeleteMapping
   public ResponseEntity<HttpStatus> deleteImage(@RequestBody Map<String, Long> requestBody) {
      Long imageId = requestBody.get("imageId");
      if (imageId == null) {
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }
      try {
         imageService.deleteImage(imageId);
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } catch (RuntimeException e) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

   // --- Helper to Convert Map to Image ---

   private Images mapToImage(ImageDTO dto) {
      Images image = new Images();
      image.setAltText(dto.getAltText());
      image.setDisplayOrder(dto.getDisplayOrder());
      if (dto.getImageBase64() != null && !dto.getImageBase64().isEmpty()) {
         String base64Data = dto.getImageBase64();
         if (base64Data.contains(",")) {
            base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
         }
         byte[] imageBytes = Base64.getDecoder().decode(base64Data);
         image.setImageBytes(imageBytes);
      }
      return image;
   }

}
