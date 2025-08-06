package org.project.ecom.controller;

import jakarta.validation.Valid;
import org.project.ecom.model.Brand;
import org.project.ecom.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class BrandController {

    @Autowired
    AdminService adminService;

    @GetMapping("/brands")
    public ResponseEntity<List<Brand>> getAllBrand(){
        return ResponseEntity.ok(adminService.getAllBrand());
    }

    @GetMapping("/brands/{brandId}")
    public ResponseEntity<Brand> getBrandById(Long id){
        return ResponseEntity.ok(adminService.getBrandById(id));
    }

    @PostMapping("/brands")
    public ResponseEntity<?> createBrand(@RequestBody @Valid Brand model, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return ResponseEntity.badRequest().body(null);
        }
        adminService.createBrand(model);
        return ResponseEntity.ok("Brand created successfully");
    }

    @PutMapping("/brands")
    public ResponseEntity<?> updateBrand(@RequestBody @Valid Brand model,BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            ResponseEntity.badRequest().body(null);
        }
        adminService.updateBrand(model);
        return ResponseEntity.ok("Brand updated successfully");
    }

    @PostMapping("/delete-brands")
    public ResponseEntity<?> deleteBrand(@RequestBody @Valid Brand model,BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            ResponseEntity.badRequest().body(null);
        }
        adminService.deleteBrand(model);
        return ResponseEntity.ok("Brand deleted successfully");
    }







}
