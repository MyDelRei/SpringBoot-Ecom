package org.project.ecom.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class DashboardResponse {
    private Long totalSku;
    private Long totalSupplier;
    private Long totalWarehouse;
    private Long totalPurchase;
    private List<ProductArrivalDTO> recentProductArrival;
    private List<RecentCheckoutProjection> recentCheckoutProjections;
}
