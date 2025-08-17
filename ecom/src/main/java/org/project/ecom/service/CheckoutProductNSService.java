package org.project.ecom.service;


import org.project.ecom.model.CheckoutProductNonserial;
import org.project.ecom.model.Inventory;
import org.project.ecom.model.Sku;
import org.project.ecom.model.dto.CheckoutNonSerialDto;
import org.project.ecom.repository.CheckoutNonSerialRepository;
import org.project.ecom.repository.InventoryRepository;
import org.project.ecom.repository.SkuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckoutProductNSService {
    @Autowired
    private CheckoutNonSerialRepository checkoutRepo;

    @Autowired
    private InventoryRepository inventoryRepo;

    @Autowired
    private SkuRepository skuRepo;

    public void checkoutNonSerial(String skuCode, int requestedQty) {
        // 1. Validate SKU exists
        Sku sku = skuRepo.findBySkuCode(skuCode)
                .orElseThrow(() -> new RuntimeException("SKU not found"));

        // 2. Fetch inventory for this SKU
        List<Inventory> inventories = inventoryRepo.findBySku(sku);

        int totalAvailable = inventories.stream()
                .mapToInt(inv -> inv.getQuantity().intValue())
                .sum();

        if (requestedQty > totalAvailable) {
            throw new RuntimeException("Insufficient stock");
        }

        // 3. Distribute quantity and update inventory
        int remainingQty = requestedQty;
        for (Inventory inv : inventories) {
            if (remainingQty <= 0) break;

            int invQty = inv.getQuantity().intValue();

            if (invQty >= remainingQty) {
                inv.setQuantity((long) (invQty - remainingQty));
                if (inv.getQuantity() == 0) {
                    inventoryRepo.delete(inv); // remove if 0
                } else {
                    inventoryRepo.save(inv);
                }
                remainingQty = 0;
            } else {
                remainingQty -= invQty;
                inventoryRepo.delete(inv); // remove exhausted inventory
            }
        }

        // 4. Save to checkout table
        CheckoutProductNonserial checkout = new CheckoutProductNonserial();
        checkout.setSku(sku.getSkuCode());
        checkout.setQuantity((long) requestedQty);
        checkoutRepo.save(checkout);
    }


}
