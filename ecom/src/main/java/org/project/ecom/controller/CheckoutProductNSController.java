package org.project.ecom.controller;

import org.project.ecom.model.CheckoutProductSn;
import org.project.ecom.service.CheckoutProductNSService;
import org.project.ecom.service.CheckoutProductSNService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/checkout/ns")
public class CheckoutProductNSController {


    @Autowired
    CheckoutProductNSService service;

    @PostMapping("/non-serial")
    public ResponseEntity<?> checkoutNonSerial(
            @RequestParam String skuCode,
            @RequestParam int quantity) {

        try {
            // Call your service method
            service.checkoutNonSerial(skuCode, quantity);

            // Return success response
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Checkout completed successfully"
            ));
        } catch (RuntimeException ex) {
            // Return error if SKU not found or insufficient stock
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", ex.getMessage()
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "error",
                    "message", "An unexpected error occurred"
            ));
        }
    }





}
