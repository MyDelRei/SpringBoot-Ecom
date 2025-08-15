package org.project.ecom.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.project.ecom.model.*;
import org.project.ecom.model.dto.*;
import org.project.ecom.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductArrivalService {
    private final ProductArrivalRepository productArrivalRepository;
    private final ProductItemArrivalRepository productItemArrivalRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final SupplierPaymentRepositoty supplierPaymentRepository;
    private final UserRepository userRepository;
    private final SkuRepository skuRepository;


    // CREATE PRODUCT ARRIVAL ===
    @Transactional
    public ProductArrivalDTO createProductArrival(ProductArrivalRequestDTO dto) {
        System.out.println("[DEBUG] Received DTO: " + dto);

        // Fetch PurchaseRequest
        PurchaseRequest request = purchaseRepository.findById(dto.getRequestId())
                .orElseThrow(() -> {
                    System.err.println("[ERROR] PurchaseRequest not found with id: " + dto.getRequestId());
                    return new EntityNotFoundException("PurchaseRequest not found with id: " + dto.getRequestId());
                });

        // Fetch User
        User receivedBy = userRepository.findById(dto.getReceivedById())
                .orElseThrow(() -> {
                    System.err.println("[ERROR] User not found with id: " + dto.getReceivedById());
                    return new EntityNotFoundException("User not found with id: " + dto.getReceivedById());
                });

        // Validate status
        if (!List.of("approved", "paid").contains(request.getStatus().toLowerCase())) {
            throw new IllegalStateException("Purchase request must be in 'approved' or 'paid' status. Current status: " + request.getStatus());
        }

        // Fetch purchase items
        List<PurchaseItemProjection> purchaseItems = purchaseItemRepository.findPurchaseItemsWithAttributes(dto.getRequestId());
        if (purchaseItems.isEmpty()) {
            throw new IllegalStateException("No purchase items found for Request ID: " + dto.getRequestId());
        }

        // Create ProductArrival entity
        ProductArrival arrival = ProductArrival.builder()
                .request(request)
                .invoiceNumber(dto.getInvoiceNumber())
                .arrivalDate(dto.getArrivalDate())
                .receivedBy(receivedBy)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        arrival = productArrivalRepository.save(arrival);
        System.out.println("[INFO] ProductArrival created successfully with ID: " + arrival.getId());

        // Process each item
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (ProductItemArrivalRequestDTO itemDto : dto.getItems()) {
                Sku sku = skuRepository.findById(itemDto.getSkuId())
                        .orElseThrow(() -> {
                            System.err.println("[ERROR] SKU not found with id: " + itemDto.getSkuId());
                            return new EntityNotFoundException("Sku not found with id: " + itemDto.getSkuId());
                        });

                // Type-safe matching of purchase items
                PurchaseItemProjection matchingPurchaseItem = purchaseItems.stream()
                        .peek(pi -> System.out.println("[DEBUG] Purchase item SKU: " + pi.getSkuId() + ", Arrival SKU: " + itemDto.getSkuId()))
                        .filter(pi -> pi.getSkuId() != null && pi.getSkuId().longValue() == itemDto.getSkuId().longValue())
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException(
                                "No purchase item found for SKU ID: " + itemDto.getSkuId() + " in Request ID: " + dto.getRequestId()
                        ));




                // Validate quantity
                if (itemDto.getQuantityReceived() > matchingPurchaseItem.getQuantity()) {
                    throw new IllegalStateException("Quantity received exceeds requested quantity for SKU ID: "
                            + itemDto.getSkuId() + ". Received: "
                            + itemDto.getQuantityReceived() + ", Requested: "
                            + matchingPurchaseItem.getQuantity());
                }

                // Save ProductItemArrival
                ProductItemArrival item = ProductItemArrival.builder()
                        .arrival(arrival)
                        .sku(sku)
                        .quantityReceived(itemDto.getQuantityReceived())
                        .note(itemDto.getNote())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                productItemArrivalRepository.save(item);
            }
        } else {
            throw new IllegalStateException("Product arrival must include at least one item.");
        }

        // Prepare response DTO
        List<ProductItemArrival> savedItems = productItemArrivalRepository.findByArrivalId(arrival.getId());
        List<ProductItemArrivalDTO> itemDtos = savedItems.stream()
                .map(item -> new ProductItemArrivalDTO(
                        item.getSku().getSkuId(),
                        item.getSku().getSkuCode(),
                        item.getSku().getProduct().getProductName(),
                        item.getQuantityReceived(),
                        item.getNote()))
                .collect(Collectors.toList());

        return new ProductArrivalDTO(
                arrival.getId(),
                arrival.getRequest().getId(),
                arrival.getRequest().getStatus(),
                arrival.getInvoiceNumber(),
                arrival.getArrivalDate(),
                arrival.getReceivedBy().getUser_id(),
                itemDtos
        );
    }


    // == == == == == == == == ==
    // GET PRODUCT ARRIVAL BY ID
    // == == == == == == == == ==
    public ProductArrivalDTO getProductArrival(Long id) {
        ProductArrival arrival = productArrivalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductArrival not found with id: " + id));

        List<ProductItemArrival> items = productItemArrivalRepository.findByArrivalId(id);
        List<ProductItemArrivalDTO> itemDtos = items.stream()
                .map(item -> new ProductItemArrivalDTO(
                        item.getSku().getSkuId(),
                        item.getSku().getSkuCode(),
                        item.getSku().getProduct().getProductName(),
                        item.getQuantityReceived(),
                        item.getNote()))
                .collect(Collectors.toList());

        return new ProductArrivalDTO(
                arrival.getId(),
                arrival.getRequest().getId(),
                arrival.getRequest().getStatus(),
                arrival.getInvoiceNumber(),
                arrival.getArrivalDate(),
                arrival.getReceivedBy().getUser_id(),
                itemDtos
        );
    }

    // == == == == == == == == ==
    // GET ALL
    // == == == == == == == == ==
    public List<ProductArrivalDTO> getAllProductArrivals() {
        List<ProductArrival> arrivals = productArrivalRepository.findAll();
        return arrivals.stream().map(arrival -> {
            List<ProductItemArrival> items = productItemArrivalRepository.findByArrivalId(arrival.getId());
            List<ProductItemArrivalDTO> itemDtos = items.stream()
                    .map(item -> new ProductItemArrivalDTO(

                            item.getSku().getSkuId(),
                            item.getSku().getSkuCode(),
                            item.getSku().getProduct().getProductName(),
                            item.getQuantityReceived(),
                            item.getNote()))
                    .collect(Collectors.toList());

            return new ProductArrivalDTO(
                    arrival.getId(),
                    arrival.getRequest().getId(),
                    arrival.getRequest().getStatus(),
                    arrival.getInvoiceNumber(),
                    arrival.getArrivalDate(),
                    arrival.getReceivedBy().getUser_id(),
                    itemDtos
            );
        }).collect(Collectors.toList());
    }

    // == == == == == == == == ==
    // DELETE
    // == == == == == == == == ==
    @Transactional
    public void deleteProductArrival(Long id) {
        ProductArrival arrival = productArrivalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductArrival not found with id: " + id));

        // Delete ProductArrival (cascades to ProductItemArrival due to ON DELETE CASCADE)
        productArrivalRepository.delete(arrival);
    }


}
