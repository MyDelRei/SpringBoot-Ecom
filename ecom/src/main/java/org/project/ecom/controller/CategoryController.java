package org.project.ecom.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.ecom.model.Category;
import org.project.ecom.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class CategoryController {

    private final AdminService adminService;

    @GetMapping("/category")
    public ResponseEntity<List<Category>> getAllCategory(){
        return ResponseEntity.ok(adminService.getAllCategory());
    }

    @PostMapping("/category")
    public ResponseEntity<?> createCategory(@RequestBody @Valid Category model, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return ResponseEntity.badRequest().body("Validation errors");
        }
        adminService.createCategory(model);
        return ResponseEntity.ok("Category created successfully");
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable("categoryId") Long categoryId){
        return ResponseEntity.ok(adminService.getCategoryById(categoryId));
    }
    @PutMapping("/category")
    public ResponseEntity<?> updateCategory(@RequestBody @Valid Category model,BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            ResponseEntity.badRequest().body("Validation errors");
        }
        adminService.updateCategory(model);
        return ResponseEntity.ok("Category updated successfully");
    }
    @PostMapping("/delete-category")
    public ResponseEntity<?> deleteCategory(@RequestBody @Valid Category model,BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            ResponseEntity.badRequest().body("Validation errors");
        }
        adminService.deleteCategory(model);
        return ResponseEntity.ok("Category deleted successfully");
    }


}
