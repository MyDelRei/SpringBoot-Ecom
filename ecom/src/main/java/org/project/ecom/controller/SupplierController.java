package org.project.ecom.controller;

import jakarta.validation.Valid;
import org.project.ecom.model.Attribute;
import org.project.ecom.model.Supplier;
import org.project.ecom.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/v1/Supplier")
public class SupplierController {

    @Autowired

    private SupplierService supplierService;

    //    get all supllier
    @GetMapping("/get_Suppier")
    public ResponseEntity<List<Supplier>>getAllsupplier(){
        return ResponseEntity.ok(supplierService.getAllSupplier());
    }

    // get attribute by id
    @GetMapping("/suppliers/{Id}")
    public ResponseEntity<Supplier> getSupplierById(Long Id){
        return ResponseEntity.ok(supplierService.getSublierById(Id));
    }

//    create supplier
    @PostMapping("/suppliers")
    private ResponseEntity<?> createSupplier(@RequestBody @Valid Supplier model, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            ResponseEntity.badRequest().body(null);
        }

        supplierService.saveSupplier(model);
        return ResponseEntity.ok("Supplier created successfully");

    }
//    @PostMapping("/suppliers")
//    public ResponseEntity<?> createSupplier(@RequestBody @Valid Supplier model, BindingResult bindingResult) {
//        if (bindingResult.hasErrors()) {
//            return ResponseEntity.badRequest().body("Validation failed");
//        }
//
//        supplierService.saveSupplier(model);
//        return ResponseEntity.ok("Supplier created successfully");
//    }

    // Update attribute

    @PutMapping("/supplier")
    public ResponseEntity<?> updateSupplier(@RequestBody @Valid Supplier model ,BindingResult bindingResult) {
    if(bindingResult.hasErrors()){
       return ResponseEntity.badRequest().body(" validation field");
    }
        supplierService.updateSupplier(model);

        return ResponseEntity.ok("supplier update succesfully");
    }

//    public SupplierService getSupplierService() {
//
//
//
//    }
// delete supplier
@PostMapping("/delete-supplier")
public ResponseEntity<?> deleteSupplier(@RequestBody @Valid Supplier model, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
        return ResponseEntity.badRequest().body("Invalid supplier data");
    }

    supplierService.deleteSupplier(model);
    return ResponseEntity.ok("Supplier deleted successfully");
}



}
