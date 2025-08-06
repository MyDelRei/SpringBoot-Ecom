package org.project.ecom.repository;

import org.project.ecom.model.PurchaseItem;
import org.project.ecom.model.dto.PurchaseItemDTO;
import org.project.ecom.model.dto.PurchaseItemProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {
    @Query(value = """
        SELECT
            pi.request_item_id AS requestItemId,
            pi.request_id AS requestId,
            pi.quantity_request AS quantity,
            sku.base_price * pi.quantity_request AS totalBasePrice,
            sku.base_price AS basePrice,
            p.product_id AS productId,
            p.product_name AS productName,
            a.attribute_name AS attributeName,
            sa.attribute_value AS attributeValue
        FROM
            Purchase_Item pi
            JOIN sku ON pi.sku_id = sku.sku_id
            JOIN Product p ON sku.product_id = p.product_id
            LEFT JOIN SKU_ATTRIBUTE sa ON sku.sku_id = sa.sku_id
            LEFT JOIN ATTRIBUTE a ON sa.attribute_id = a.attribute_id
        WHERE
            pi.request_id = :requestId
        ORDER BY
            pi.request_item_id, a.attribute_name
        """, nativeQuery = true)
    List<PurchaseItemProjection> findPurchaseItemsWithAttributes(@Param("requestId") Long requestId);


}
