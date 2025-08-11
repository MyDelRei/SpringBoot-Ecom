package org.project.ecom.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.ecom.model.SupplierPaymentInvoice;
import org.project.ecom.model.dto.ProductArrivalDTO;
import org.project.ecom.model.dto.ProductArrivalRequestDTO;
import org.project.ecom.model.dto.ProductItemArrivalDTO;
import org.project.ecom.model.dto.UserDTO;
import org.project.ecom.repository.SupplierPaymentInvoiceRepository;
import org.project.ecom.repository.UserRepository;
import org.project.ecom.service.ProductArrivalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class ProductArrivalController {
    private final ProductArrivalService productArrivalService;
    private final SupplierPaymentInvoiceRepository invoiceRepository;
    private final UserRepository userRepository;




    // Create a new Product Arrival
    @PostMapping("/product-arrival")
    public ResponseEntity<ProductArrivalDTO> createProductArrival(@RequestBody @Valid ProductArrivalRequestDTO dto) {
        System.out.println("[DEBUG] Incoming DTO: " + dto); // Log the incoming DTO
        ProductArrivalDTO response = productArrivalService.createProductArrival(dto);
        return ResponseEntity.ok(response);

    }


    @GetMapping("/product-arrival/{id}")
    public ResponseEntity<ProductArrivalDTO> getProductArrival(@PathVariable Long id) {
        ProductArrivalDTO dto = productArrivalService.getProductArrival(id);
        return ResponseEntity.ok(dto);
    }

    // Get all product arrivals
    @GetMapping("/product-arrival")
    public ResponseEntity<List<ProductArrivalDTO>> getAllProductArrivals() {
        List<ProductArrivalDTO> dtos = productArrivalService.getAllProductArrivals();
        return ResponseEntity.ok(dtos);
    }

    // Delete a product arrival by ID
    @DeleteMapping("/product-arrival/{id}")
    public ResponseEntity<Void> deleteProductArrival(@PathVariable Long id) {
        productArrivalService.deleteProductArrival(id);
        System.out.println("[Debug] Deleted ProductArrival with ID: " + id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/invoice-numbers")
    public ResponseEntity<List<Long>> getAllInvoiceNumbers() {
        List<Long> invoiceNumbers = invoiceRepository.findAllInvoiceNumbers();

        if (invoiceNumbers == null || invoiceNumbers.isEmpty()) {
            System.out.println("No invoice numbers found.");
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(invoiceNumbers);
    }
    @GetMapping("/{invoiceNumber}/request")
    public ResponseEntity<?> getRequestByInvoice(@PathVariable Long invoiceNumber) {
        Long requestId = invoiceRepository.findWithPaymentAndRequestByInvoiceNumber(invoiceNumber);
        if (requestId != null) {
            Map<String, Long> response = Map.of("requestId", requestId);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(user -> new UserDTO(user.getUser_id() , user.getFirstName()+ " " + user.getLastName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }





}
