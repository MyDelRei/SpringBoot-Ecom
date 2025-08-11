package org.project.ecom.controller;

import lombok.RequiredArgsConstructor;
import org.project.ecom.model.dto.SupplierPaymentMethodRequestDTO;
import org.project.ecom.model.dto.SupplierPaymentMethodResponseDTO;
import org.project.ecom.service.SupplierPaymentMethodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers/payment-method")
@RequiredArgsConstructor
public class SupplierPaymentMethodController {

    private final SupplierPaymentMethodService service;


    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody SupplierPaymentMethodRequestDTO dto) {
        service.create(dto);
        return ResponseEntity.ok("Supplier Payment Method created successfully");
    }


    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable Long id,
                                         @RequestBody SupplierPaymentMethodRequestDTO dto) {
        service.update(id, dto);
        return ResponseEntity.ok("Supplier Payment Method updated successfully");
    }


    @GetMapping("/list")
    public ResponseEntity<List<SupplierPaymentMethodResponseDTO>> getAllPaymentMethods(){
        return ResponseEntity.ok(service.getAllPaymentMethods());
    }
}
