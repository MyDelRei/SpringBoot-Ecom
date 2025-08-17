package org.project.ecom.service;

import jakarta.transaction.Transactional;
import org.project.ecom.model.CheckoutProductSn;
import org.project.ecom.model.IndividualUnit;
import org.project.ecom.repository.CheckoutProductSNRepository;
import org.project.ecom.repository.IndividualUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZonedDateTime;


@Service
public class CheckoutProductSNService {

    @Autowired
    CheckoutProductSNRepository checkoutRepository;

    @Autowired
    IndividualUnitRepository individualRepository;

    @Transactional
    public CheckoutProductSn checkoutProduct(String serialNumber) {
        // 1️⃣ Find the unit in Individual_Unit
        IndividualUnit unit = individualRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException("Serial number not found in inventory."));

        // 2️⃣ Remove from Individual_Unit
        individualRepository.delete(unit);

        // 3️⃣ Add to Checkout_Product_SN
        CheckoutProductSn checkout = new CheckoutProductSn();
        checkout.setSku(unit.getSku().getSkuCode());
        checkout.setSerialNumber(unit.getSerialNumber());
        checkout.setCreatedAt(OffsetDateTime.now());
        checkout.setUpdatedAt(OffsetDateTime.now());

        return checkoutRepository.save(checkout);
    }
}
