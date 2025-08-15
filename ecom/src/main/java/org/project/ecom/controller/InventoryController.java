package org.project.ecom.controller;

import org.project.ecom.model.Inventory;
import org.project.ecom.model.dto.*;
import org.project.ecom.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    InventoryService inventoryService;


    @GetMapping("/non-serialized-arrivals")
    public List<ArrivalSkuNotSerializeDto> getNonSerializedSkuArrivals() {
        return inventoryService.getNonSerializedSkuArrivals();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createInventory(@RequestBody CreateInventoryDto createInventoryDto) {
        try {
            Inventory savedInventory = inventoryService.createInventory(createInventoryDto);
            return ResponseEntity.ok("Saved successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save inventory: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public Page<InventorySkuDetailProjection> searchInventory(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return inventoryService.searchInventory(searchTerm, pageable);
    }

    @PutMapping("/update-location")
    public ResponseEntity<?> updateLocation(@RequestBody InventoryUpdateLocationDto dto) {
        try {
            inventoryService.updateInventoryLocation(dto);
            return ResponseEntity.ok("Updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


//    @GetMapping("/view-stock")
//    public List<InventoryViewProjection> searchInventory(
//            @RequestParam(required = false) String searchTerm) {
//        return inventoryService.getInventoryView(searchTerm);
//    }

    @GetMapping("/view-stock")
    public Page<InventoryViewProjection> viewStock(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return inventoryService.getInventoryViewPaged(searchTerm, page, size);
    }
}