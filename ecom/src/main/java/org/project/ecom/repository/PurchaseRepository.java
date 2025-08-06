package org.project.ecom.repository;

import org.project.ecom.model.PurchaseRequest;
import org.project.ecom.model.dto.PurchaseAmountDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface PurchaseRepository extends JpaRepository<PurchaseRequest,Long> {
    @Query(value = """
        SELECT pr.request_id AS requestId,
               SUM(pi.quantity_request * s.base_price) AS totalAmount
        FROM purchase_request pr
        JOIN purchase_item pi ON pr.request_id = pi.request_id
        JOIN sku s ON pi.sku_id = s.sku_id
        WHERE pr.request_id = :requestId
        GROUP BY pr.request_id
        """, nativeQuery = true)
    Map<String, Object> findTotalAmountByRequestId(@Param("requestId") Long requestId);


    @Query(value = """
    SELECT 
        pr.request_id AS requestId,
        s.supplier_name AS supplierName,
        pr.request_date AS requestDate,
        pr.status AS requestStatus,
        CASE 
            WHEN LOWER(pr.status) = 'cancel' THEN 'cancel'
            WHEN LOWER(pr.status) = 'accept' THEN 'pending'
            ELSE 'waiting'
        END AS paymentStatus,
        pr.expected_delivery_date AS expectedDeliveryDate,
        p.product_name AS productName,
        pi.quantity_request AS quantity
    FROM 
        purchase_request pr
    JOIN 
        supplier s ON pr.supplier_id = s.supplier_id
    JOIN 
        purchase_item pi ON pr.request_id = pi.request_id
    JOIN 
        sku sk ON pi.sku_id = sk.sku_id
    JOIN 
        product p ON sk.product_id = p.product_id
""", nativeQuery = true)
    List<Map<String, Object>> GetPurchaseInfo();



}
