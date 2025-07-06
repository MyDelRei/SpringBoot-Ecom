package org.project.ecom.controller;

import org.project.ecom.model.Sku;
import org.project.ecom.service.SkuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;





@RestController
@RequestMapping("/api/v1/admin/sku") // Base path for all Sku related endpoints
public class SkuController {

   private final SkuService skuService;

   @Autowired
   public SkuController(SkuService skuService) {
      this.skuService = skuService;
   }



   @PostMapping
   public ResponseEntity<Sku> createSku(@RequestBody Sku sku) {
      Sku createdSku = skuService.saveSku(sku);
      return new ResponseEntity<>(createdSku, HttpStatus.CREATED);
   }




   @GetMapping("/{id}")
   public ResponseEntity<Sku> getSkuById(@PathVariable Long id) {
      // Using orElseThrow to directly throw ResourceNotFoundException if Sku is not found
      Sku sku = skuService.getSkuById(id)
              .orElseThrow(() -> new RuntimeException("Sku not found with ID: " + id));
      return new ResponseEntity<>(sku, HttpStatus.OK);
   }



   @GetMapping
   public ResponseEntity<List<Sku>> getAllSkus() {
      List<Sku> skus = skuService.getAllSkus();
      return new ResponseEntity<>(skus, HttpStatus.OK);
   }

   @PutMapping
   public ResponseEntity<Sku> updateSku(@RequestBody Sku skuDetails) {
      Sku updatedSku = skuService.updateSku(skuDetails);
      // The service layer already throws ResourceNotFoundException if not found,
      // so we just return OK here if it succeeds.
      return new ResponseEntity<>(updatedSku, HttpStatus.OK);
   }

   @PostMapping("/delete")
   public ResponseEntity<HttpStatus> deleteSku(@RequestBody Sku sku) {
      skuService.deleteSku(sku);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
   }
}
