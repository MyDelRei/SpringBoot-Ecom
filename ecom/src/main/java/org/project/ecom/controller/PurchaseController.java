package org.project.ecom.controller;

import org.project.ecom.model.dto.*;
import org.project.ecom.model.PurchaseRequest;
import org.project.ecom.service.PurchaseService;

import jakarta.validation.Valid;
import org.project.ecom.service.SupplierPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/purchases")
public class PurchaseController {

    @Autowired
    SupplierPaymentService supplierPaymentService;

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public ResponseEntity<String> createPurchaseRequest(@Valid @RequestBody PurchaseRequestDTO dto) {
         purchaseService.createPurchaseRequest(dto);
        return ResponseEntity.ok("Purchase request created successfully");
    }

    @GetMapping("/{requestId}/amount")
    public ResponseEntity<PurchaseAmountDTO> getPurchaseAmount(@PathVariable Long requestId) {
        PurchaseAmountDTO dto = purchaseService.getPurchaseAmount(requestId);

        if (dto.getTotalAmount() == 0.0) {
            // Optionally, you can return 404 if no data found
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/info")
    public ResponseEntity<List<PurchaseInfoDTO>> getAllPurchaseInfo() {
        List<PurchaseInfoDTO> purchaseInfos = purchaseService.getPurchaseInfo();
        if (purchaseInfos == null || purchaseInfos.isEmpty()) {
            return ResponseEntity.noContent().build();  // or ResponseEntity.ok(Collections.emptyList())
        }
        return ResponseEntity.ok(purchaseInfos);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        PurchaseStatusUpdateDTO dto = new PurchaseStatusUpdateDTO();
        dto.setRequestId(id);
        dto.setStatus(status);
        PurchaseRequest updatedRequest = purchaseService.updateStatus(dto);
        return ResponseEntity.ok("updated status");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRequest(
            @PathVariable Long id
    ){
        purchaseService.deletePurchaseRequest(id);
        return ResponseEntity.ok("deleted request");
    }

    @GetMapping("/generate")
    public String generateInvoiceNumber() {
        return purchaseService.generateInvoiceNumber();
    }

    @GetMapping("/{requestId}/supplier/get-for-payment")
    public ResponseEntity<SupplierPaymentInfoDTO> getSupplierPaymentInfo(@PathVariable Long requestId) {
        SupplierPaymentInfoDTO dto = purchaseService.getSupplierPaymentInfo(requestId);

        if (dto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{requestId}/item")
    public List<PurchaseItemProjection> getPurchaseItemsByRequestId(@PathVariable Long requestId) {
        return purchaseService.getPurchaseItemsWithAttributes(requestId);
    }

    @GetMapping("/payment-list")
    public ResponseEntity<List<SupplierPurchaseDetailsDTO>> getSupplierPurchaseDetails() {
        List<SupplierPurchaseDetailsDTO> purchaseDetailsList = supplierPaymentService.getAllSupplierPurchaseDetails();

        if (purchaseDetailsList == null || purchaseDetailsList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(purchaseDetailsList);
    }





}
