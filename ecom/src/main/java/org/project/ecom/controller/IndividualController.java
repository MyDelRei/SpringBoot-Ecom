package org.project.ecom.controller;


import jakarta.validation.Valid;
import org.project.ecom.model.IndividualUnit;
import org.project.ecom.model.dto.*;
import org.project.ecom.service.IndividualService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/individual")
public class IndividualController {

    @Autowired
    IndividualService individualUnitService;

    @GetMapping("/arrival-sku/paid")
    public List<ArrivalSkuProjection> getPaidArrivalSku() {
        return individualUnitService.getPaidArrivalSkuList();
    }


    @GetMapping
    public Page<IndividualUnitDetailProjection> getAllUnits(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return individualUnitService.getAllIndividualUnitDetails(search, pageable);
    }




    @GetMapping("/details/{arrivalId}")
    public List<ArrivalSkuDetailsDTO> getDetailsByArrivalId(@PathVariable Long arrivalId) {
        return individualUnitService.getDetailsByArrivalId(arrivalId);
    }

    @PostMapping
    public ResponseEntity<String> createIndividualUnit(@Valid @RequestBody IndividualUnitDto dto) {
        individualUnitService.createIndividualUnit(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Individual unit created successfully.");
    }

    @PostMapping("/update-location")
    public ResponseEntity<?> updateUnitLocation(@RequestBody UpdateIndividualUnitDto dto) {
        try {
            String result = individualUnitService.updateLocationBySerialNumber(dto);
            return ResponseEntity.ok().body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/{serialNumber}")
    public ResponseEntity<?> deleteBySerialNumber(@PathVariable String serialNumber) {
        boolean deleted = individualUnitService.deleteBySerialNumber(serialNumber);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unit not found");
        }
    }



}
