package org.project.ecom.controller;

import org.project.ecom.model.Warehouse;
import org.project.ecom.service.WarehouseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/warehouses")
public class WarehouseController {

   private final WarehouseService warehouseService;


   public WarehouseController(WarehouseService warehouseService) {
      this.warehouseService = warehouseService;
   }






   @GetMapping
   public ResponseEntity<List<Warehouse>> getAllWarehouses() {
      List<Warehouse> warehouses = warehouseService.getAllWarehouse();
      return ResponseEntity.ok(warehouses);
   }







   @GetMapping("/{id}")
   public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Long id) {



      Warehouse model = new Warehouse();
      model.setWarehouseId(id);
      Warehouse warehouse = warehouseService.getWarehouseById(model);
      return ResponseEntity.ok(warehouse);
   }







   @PostMapping
   public ResponseEntity<Warehouse> createWarehouse(@Valid @RequestBody Warehouse warehouse) {


      Warehouse createdWarehouse = warehouseService.saveWarehouse(warehouse);
      return new ResponseEntity<>(createdWarehouse, HttpStatus.CREATED);
   }








   @PutMapping()
   public ResponseEntity<Warehouse> updateWarehouse(@Valid @RequestBody Warehouse warehouse) {

      Warehouse updatedWarehouse = warehouseService.updateWarehouse(warehouse);
      return ResponseEntity.ok(updatedWarehouse);
   }



   @PostMapping("/delete-warehouse")
   public ResponseEntity<String> deleteWarehouse(@RequestBody Warehouse model) {
      String message = warehouseService.DeleteWarehouse(model);
      return ResponseEntity.status(HttpStatus.NO_CONTENT).body(message);
   }




   @ExceptionHandler(RuntimeException.class)
   public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {


      if (ex.getMessage() != null && ex.getMessage().contains("Warehouse not found")) {
         return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
      }

      return new ResponseEntity<>("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
   }
}