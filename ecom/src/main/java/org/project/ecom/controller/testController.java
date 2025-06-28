package org.project.ecom.controller;


import org.project.ecom.model.Product;
import org.project.ecom.service.TestingServices;
import org.project.ecom.service.TestingServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class testController {

    @Autowired
    TestingServices testingServices;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(testingServices.getAllProducts());
    }

    @GetMapping("/")
    public String helloWorld() {
        return "Hello World";
    }

}
