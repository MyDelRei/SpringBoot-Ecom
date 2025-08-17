package org.project.ecom.service;



import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import jakarta.transaction.Transactional;
import org.project.ecom.model.Inventory;
import org.project.ecom.model.Location;
import org.project.ecom.model.dto.*;
import org.project.ecom.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Clob;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    InventoryRepository inventoryRepository;

    @Autowired
    ProductItemArrivalRepository productItemArrivalRepository;



    @Autowired
    ProductArrivalRepository productArrivalRepository;

    @Autowired
    SkuRepository skuRepository;

    @Autowired
    LocationRepository locationRepository;


    public List<ArrivalSkuNotSerializeDto> getNonSerializedSkuArrivals() {
        return inventoryRepository.findNonSerializedSkuArrivals();
    }


    @Transactional
    public Inventory createInventory(CreateInventoryDto dto) {
        // Validate related entities existence
        var sku = skuRepository.findById(dto.getSkuId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid SKU ID"));

        var location = locationRepository.findById(dto.getCurrentLocationId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Location ID"));

        var arrival = productArrivalRepository.findById(dto.getArrivalId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Arrival ID"));

        // 1. Get total quantity received for this SKU in Product_Item_Arrival
        Integer quantityReceived = productItemArrivalRepository
                .findQuantityReceivedByArrivalIdAndSkuId(dto.getArrivalId(), dto.getSkuId())
                .orElseThrow(() -> new RuntimeException(
                        "No Product_Item_Arrival record found for arrivalId: " + dto.getArrivalId() + ", skuId: " + dto.getSkuId()));

        // 2. Get total quantity already stored in Inventory for this arrival and SKU
        Integer totalStored = inventoryRepository.findTotalQuantityStoredByArrivalIdAndSkuId(dto.getArrivalId(), dto.getSkuId());

        // 3. Calculate new total if this create request is accepted
        int newTotal = Math.toIntExact(totalStored + dto.getQuantityStored());

        // 4. Validate that new total does not exceed quantity received
        if (newTotal > quantityReceived) {
            throw new RuntimeException("Cannot store quantity: exceeds received quantity. " +
                    "Total received: " + quantityReceived + ", Already stored: " + totalStored +
                    ", Trying to add: " + dto.getQuantityStored());
        }

        // Create Inventory entity
        Inventory inventory = new Inventory();
        inventory.setSku(sku);
        inventory.setArrival(arrival);
        inventory.setQuantity(dto.getQuantityStored());
        inventory.setCurrentLocation(location);

        // Save and return
        return inventoryRepository.save(inventory);
    }



    private void validateInventoryQuantity(Long arrivalId, Long skuId, Integer quantityToAdd) {
        // 1. Get total quantity received for this SKU in Product_Item_Arrival
        Integer quantityReceived = productItemArrivalRepository
                .findQuantityReceivedByArrivalIdAndSkuId(arrivalId, skuId)
                .orElseThrow(() -> new RuntimeException(
                        "No Product_Item_Arrival record found for arrivalId: " + arrivalId + ", skuId: " + skuId));

        // 2. Get total quantity already stored in Inventory for this SKU and arrival
        Integer quantityStored = inventoryRepository
                .findTotalQuantityStoredByArrivalIdAndSkuId(arrivalId, skuId);

        if (quantityStored == null) quantityStored = 0;

        // 3. Check if adding quantityToAdd would exceed quantityReceived
        if (quantityStored + quantityToAdd > quantityReceived) {
            throw new RuntimeException("Cannot store more than received quantity! " +
                    "Stored: " + quantityStored + ", Trying to add: " + quantityToAdd +
                    ", Received: " + quantityReceived);
        }
    }

    @Transactional
    public void updateInventoryLocation(InventoryUpdateLocationDto dto) {
        Inventory inventory = inventoryRepository.findById(dto.getInventoryId())
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found with id: " + dto.getInventoryId()));

        Location newLocation = locationRepository.findById(dto.getCurrentLocationId())
                .orElseThrow(() -> new IllegalArgumentException("Location not found with id: " + dto.getCurrentLocationId()));

        inventory.setCurrentLocation(newLocation);

        LocalDateTime nowLocalDateTime = LocalDateTime.ofInstant(Instant.now(), ZoneId.systemDefault());
        inventory.setUpdatedAt(nowLocalDateTime);

        inventoryRepository.save(inventory);  // <- Add this
    }


    public Page<InventorySkuDetailProjection> searchInventory(String searchTerm, Pageable pageable) {
        return inventoryRepository.findAllInventorySkuDetails(searchTerm == null ? "" : searchTerm, pageable);
    }

    public Page<InventoryViewProjection> getInventory(String skuCode, String locationSection, Pageable pageable) {
        return inventoryRepository.findInventoryViewWithPagination(skuCode, locationSection, pageable);
    }


    public List<InventoryViewProjection> getInventoryView(String searchTerm) {
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("get_inventory_view");

        // Register the IN parameter
        query.registerStoredProcedureParameter(1, String.class, ParameterMode.IN);
        // Register the OUT cursor parameter
        query.registerStoredProcedureParameter(2, void.class, ParameterMode.REF_CURSOR);

        // Set the IN parameter
        query.setParameter(1, searchTerm);

        // Execute the procedure
        query.execute();

        // Get results from the REF_CURSOR (this returns List<Object[]>)
        List<Object[]> rows = query.getResultList();

        // Map results to your projection interface or DTO
        List<InventoryViewProjection> list = new ArrayList<>();
        for (Object[] row : rows) {
            InventoryViewProjection dto = new InventoryViewProjection() {
                public String getBrandName() { return (String) row[0]; }
                public String getProductName() { return (String) row[1]; }
                public String getCategories() { return (String) row[2]; }
                public String getSkuCode() { return (String) row[3]; }
                public String getSkuDescription() {
                    if (row[4] instanceof Clob) {
                        try {
                            Clob clob = (Clob) row[4];
                            return clob.getSubString(1, (int) clob.length());
                        } catch (Exception e) {
                            return null;
                        }
                    }
                    return (String) row[4];
                }
                public BigDecimal getBasePrice() { return (BigDecimal) row[5]; }
                public BigDecimal getSalePrice() { return (BigDecimal) row[6]; }
                public Character getIsSerialized() { return (Character) row[7]; }
                public Long getLocationId() { return ((Number) row[8]).longValue(); }
                public String getLocationPath() { return (String) row[9]; }
                public String getLocationNote() { return (String) row[10]; }
                public Integer getIndividualQuantity() { return ((Number) row[11]).intValue(); }
                public Integer getInventoryQuantity() { return ((Number) row[12]).intValue(); }
                public Integer getTotalQuantity() { return ((Number) row[13]).intValue(); }
            };
            list.add(dto);
        }
        return list;
    }

    public Page<InventoryViewProjection> getInventoryViewPaged(String searchTerm, int page, int size) {
        // Get full list from your existing method (up to 500 rows from DB)
        List<InventoryViewProjection> fullList = getInventoryView(searchTerm);

        // Optional additional filtering (if you want to further filter in Java)
        // Here we assume searchTerm is already applied in your procedure,
        // but if you want, you can refine again here, or skip this.

        // Sort by brand name ascending (example)
        List<InventoryViewProjection> sortedList = fullList.stream()
                .sorted(Comparator.comparing(InventoryViewProjection::getBrandName))
                .collect(Collectors.toList());

        // Calculate pagination indexes
        int start = page * size;
        int end = Math.min(start + size, sortedList.size());

        List<InventoryViewProjection> pagedList = (start > sortedList.size())
                ? Collections.emptyList()
                : sortedList.subList(start, end);

        Pageable pageable = PageRequest.of(page, size);

        // Return a Spring Data Page object
        return new PageImpl<>(pagedList, pageable, sortedList.size());
    }


    public List<InventorySkuProjection> getInventoryBySku(String sku) {
        return inventoryRepository.findBySku(sku);
    }








}
