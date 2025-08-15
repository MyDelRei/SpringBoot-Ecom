package org.project.ecom.service;

import jakarta.transaction.Transactional;
import org.project.ecom.model.IndividualUnit;
import org.project.ecom.model.Location;
import org.project.ecom.model.ProductArrival;
import org.project.ecom.model.Sku;
import org.project.ecom.model.dto.*;
import org.project.ecom.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Service
public class IndividualService {
    
    @Autowired
    IndividualUnitRepository individualUnitRepository;

    @Autowired
    ProductItemArrivalRepository productItemArrivalRepository;



    @Autowired
    ProductArrivalRepository productArrivalRepository;

    @Autowired
    SkuRepository skuRepository;

    @Autowired
    LocationRepository locationRepository;

    public List<ArrivalSkuProjection> getPaidArrivalSkuList() {
        return individualUnitRepository.findArrivalSkuByStatus("approved");
    }

    public List<ArrivalSkuDetailsDTO> getDetailsByArrivalId(Long arrivalId) {
        return individualUnitRepository.findDetailsByArrivalId(arrivalId);
    }

    public String createIndividualUnit(IndividualUnitDto dto) {
        // Validate before proceeding
        validateUnitCount(dto.getArrivalId(), dto.getSkuId());

        Sku sku = skuRepository.findById(dto.getSkuId())
                .orElseThrow(() -> new RuntimeException("SKU not found with id: " + dto.getSkuId()));

        Location location = locationRepository.findById(dto.getCurrentLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + dto.getCurrentLocationId()));

        ProductArrival arrival = productArrivalRepository.findById(dto.getArrivalId())
                .orElseThrow(() -> new RuntimeException("ProductArrival not found with id: " + dto.getArrivalId()));

        IndividualUnit unit = new IndividualUnit();
        unit.setSku(sku);
        unit.setCurrentLocation(location);
        unit.setArrival(arrival);
        unit.setSerialNumber(dto.getSerialNumber());

        individualUnitRepository.save(unit);
        return "Added";
    }



    private void validateUnitCount(Long arrivalId, Long skuId) {
        // 1. Get total quantity received for this SKU in Product_Item_Arrival
        Integer quantityReceived = productItemArrivalRepository
                .findQuantityReceivedByArrivalIdAndSkuId(arrivalId, skuId)
                .orElseThrow(() -> new RuntimeException(
                        "No Product_Item_Arrival record found for arrivalId: " + arrivalId + ", skuId: " + skuId));

        // 2. Get current number of individual units already created
        Long existingCount = individualUnitRepository.countByArrivalIdAndSkuId(arrivalId, skuId);

        // 3. Check if adding another one would exceed allowed quantity
        if (existingCount >= quantityReceived) {
            throw new RuntimeException("All units for this SKU have already been created. (" +
                    existingCount + "/" + quantityReceived + ")");
        }
    }



    public Page<IndividualUnitDetailProjection> getAllIndividualUnitDetails(String searchTerm, Pageable pageable) {
        return individualUnitRepository.findAllIndividualUnitDetails(searchTerm == null ? "" : searchTerm, pageable);
    }






    @Transactional
    public String updateLocationBySerialNumber(UpdateIndividualUnitDto dto) {
        IndividualUnit unit = individualUnitRepository.findBySerialNumber(dto.getSerialNumber())
                .orElseThrow(() -> new RuntimeException("Individual unit not found with serial number: " + dto.getSerialNumber()));

        Location newLocation = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + dto.getLocationId()));

        unit.setCurrentLocation(newLocation);
        individualUnitRepository.save(unit);
        return "Location updated successfully";
    }


    public boolean deleteBySerialNumber(String serialNumber) {
        Optional<IndividualUnit> unitOpt = individualUnitRepository.findBySerialNumber(serialNumber);
        if (unitOpt.isPresent()) {
            individualUnitRepository.delete(unitOpt.get());
            return true;
        }
        return false;
    }



}
