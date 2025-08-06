package org.project.ecom.controller;

import jakarta.validation.Valid;
import org.project.ecom.model.Supplier;
import org.project.ecom.model.SupplierProduct;
import org.project.ecom.model.dto.SupplierProductDTO;
import org.project.ecom.model.dto.SupplierProductRequestDto;
import org.project.ecom.model.dto.SupplierResponseDto;
import org.project.ecom.model.dto.SupplierWithProductsDto;
import org.project.ecom.repository.SupplierProductRepository;
import org.project.ecom.repository.SupplierRepository;
import org.project.ecom.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @Autowired
    SupplierProductRepository supplierProductRepository;

    // ✅ Create Supplier
    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody @Valid Supplier model, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Invalid supplier data");
        }
        Supplier saved = supplierService.saveSupplier(model);
        return ResponseEntity.ok(saved);
    }

    // ✅ Get All Suppliers
    @GetMapping
    public ResponseEntity<List<SupplierResponseDto>> getAllSuppliers() {
        List<SupplierResponseDto> suppliers = supplierService.getAllSupplierDtos();
        return ResponseEntity.ok(suppliers);
    }


    // ✅ Get Supplier by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierById(@PathVariable Long id) {
        try {
            Supplier supplier = supplierService.getSupplierById(id);
            return ResponseEntity.ok(supplier);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Supplier not found with ID: " + id);
        }
    }

    // ✅ Update Supplier
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody @Valid Supplier model, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Invalid supplier data");
        }
        try {
            model.setId(id);
            supplierService.updateSupplier(model);
            return ResponseEntity.ok("Supplier updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Supplier not found with ID: " + id);
        }
    }

    // ✅ Delete Supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        try {
            Supplier supplier = supplierService.getSupplierById(id);
            supplierService.deleteBrand(supplier);
            return ResponseEntity.ok("Supplier deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Supplier not found with ID: " + id);
        }
    }

    @GetMapping("/all-supplier-products")
    public ResponseEntity<List<SupplierProductDTO>> getAllSupplierProducts() {
        List<SupplierProductDTO> result = supplierService.getAllSuppliersWithProducts();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all-supplier-products/{id}")
    public ResponseEntity<SupplierProductDTO> getSupplierDetails(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierWithProducts(id));
    }

    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> createSupplierProducts(@RequestBody List<SupplierProductRequestDto> dtos) {
        List<SupplierProduct> savedProducts = supplierService.createSupplierProducts(dtos);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Successfully created " + savedProducts.size() + " supplier products.");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/supplier-product/{id}")
    public ResponseEntity<String> deleteSupplierProduct(@PathVariable Long id) {
        supplierProductRepository.deleteById(id);
        return ResponseEntity.ok("Supplier product deleted successfully");
    }


    @GetMapping("/supplier/{id}/details")
    public ResponseEntity<SupplierWithProductsDto> getSupplierDetailsAtt(@PathVariable Long id) {
        SupplierWithProductsDto dto = supplierService.getSupplierWithProductsAtt(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }




}
