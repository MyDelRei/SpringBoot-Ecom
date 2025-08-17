package org.project.ecom.controller;


import org.project.ecom.model.dto.DashboardResponse;
import org.project.ecom.model.dto.ProductArrivalDTO;
import org.project.ecom.model.dto.RecentCheckoutProjection;
import org.project.ecom.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @Autowired
    SkuService skuService;

    @Autowired
    SupplierService supplierService;

    @Autowired
    WarehouseService warehouseService;

    @Autowired
    PurchaseService purchaseService;

    @Autowired
    ProductArrivalService productArrivalService;

    @Autowired
    CheckoutProductNSService checkoutProductNSService;



    @GetMapping("/data")
    public ResponseEntity<?> dashboard() {
        List<ProductArrivalDTO> RecentProductArrival = productArrivalService.getAllProductArrivals();

        List<RecentCheckoutProjection> recentCheckoutProjections = checkoutProductNSService.getRecentCheckouts();

        DashboardResponse response = new DashboardResponse();
        response.setTotalSku(skuService.totalSku());
        response.setTotalSupplier(supplierService.totalSupplier());
        response.setTotalWarehouse(warehouseService.totalWarehouse());
        response.setTotalPurchase(purchaseService.totalPurchase());
        response.setRecentProductArrival(RecentProductArrival);
        response.setRecentCheckoutProjections(recentCheckoutProjections);

        return ResponseEntity.ok(response);
    }
}
