package org.project.ecom.controller;

import jakarta.validation.Valid;
import org.project.ecom.model.Supplier;
import org.project.ecom.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/v1/Supplier")
public class SupplierController {

    @Autowired
    SupplierService supplierService;

    @PostMapping
    private ResponseEntity<?> createSupplier(@RequestBody @Valid Supplier model, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            ResponseEntity.badRequest().body(null);
        }

        supplierService.saveSupplier(model);
        return ResponseEntity.ok("Supplier created successfully");

    }





}
