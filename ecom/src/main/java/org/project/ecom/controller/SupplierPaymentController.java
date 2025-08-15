package org.project.ecom.controller;

import lombok.RequiredArgsConstructor;
import org.project.ecom.model.dto.SupplierPaymentRequest;
import org.project.ecom.service.SupplierPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/supplier-payments")
@RequiredArgsConstructor
public class SupplierPaymentController {

    private final SupplierPaymentService paymentService;

    @PostMapping
    public ResponseEntity<String> createPayment(@RequestBody SupplierPaymentRequest request) {
        paymentService.processPayment(request);
        return ResponseEntity.ok("Payment successfully recorded");
    }
}
