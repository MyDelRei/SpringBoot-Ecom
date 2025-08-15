package org.project.ecom.repository;

import org.project.ecom.model.Inventory;
import org.project.ecom.model.dto.ArrivalSkuNotSerializeDto;
import org.project.ecom.model.dto.InventorySkuDetailProjection;
import org.project.ecom.model.dto.InventoryViewProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query(value = """
    SELECT
        s.sku_id AS skuId,
        pa.arrival_id AS arrivalId,
        s.sku_code AS skuCode,
        pa.arrival_date AS arrivalDate,
        pia.quantity_received AS quantityReceived
    FROM
        Product_Arrival pa
    JOIN
        Product_Item_Arrival pia ON pa.arrival_id = pia.arrival_id
    JOIN
        sku s ON pia.sku_id = s.sku_id
    JOIN (
        SELECT
            pia2.sku_id,
            MAX(pa2.arrival_date) AS latestArrivalDate
        FROM
            Product_Arrival pa2
        JOIN
            Product_Item_Arrival pia2 ON pa2.arrival_id = pia2.arrival_id
        GROUP BY
            pia2.sku_id
    ) latest ON latest.sku_id = s.sku_id AND latest.latestArrivalDate = pa.arrival_date
    WHERE
        s.is_serialized = 'N'
    """, nativeQuery = true)
    List<ArrivalSkuNotSerializeDto> findNonSerializedSkuArrivals();

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM Inventory i WHERE i.arrival.id = :arrivalId AND i.sku.skuId = :skuId")
    Integer findTotalQuantityStoredByArrivalIdAndSkuId(@Param("arrivalId") Long arrivalId, @Param("skuId") Long skuId);

    @Query(value = """
    SELECT
        inv.inventory_id AS inventoryId,
        p.product_name AS productName,
        s.sku_id AS skuId,
        s.sku_code AS skuCode,
        inv.quantity AS quantityStored,
        l.section || ' - ' || l.aisle || ' - ' || l.bin AS currentLocation
    FROM inventory inv
    JOIN sku s ON inv.sku_id = s.sku_id
    JOIN product p ON s.product_id = p.product_id
    LEFT JOIN location l ON inv.current_location_id = l.location_id
    WHERE (LOWER(p.product_name) LIKE '%' || LOWER(:searchTerm) || '%'
       OR LOWER(s.sku_code) LIKE '%' || LOWER(:searchTerm) || '%')
      AND s.is_serialized = 'N'
    ORDER BY p.product_name, s.sku_code
    """,
            countQuery = """
    SELECT COUNT(*)
    FROM inventory inv
    JOIN sku s ON inv.sku_id = s.sku_id
    JOIN product p ON s.product_id = p.product_id
    WHERE (LOWER(p.product_name) LIKE '%' || LOWER(:searchTerm) || '%'
       OR LOWER(s.sku_code) LIKE '%' || LOWER(:searchTerm) || '%')
      AND s.is_serialized = 'N'
    """,
            nativeQuery = true)
    Page<InventorySkuDetailProjection> findAllInventorySkuDetails(@Param("searchTerm") String searchTerm, Pageable pageable);


    @Query(value = """

            SELECT
            b.name AS brandName,
            p.product_name AS productName,
            LISTAGG(c.name, ', ') WITHIN GROUP (ORDER BY c.name) AS categories,
            s.sku_code AS skuCode,
            DBMS_LOB.SUBSTR(s.description, 4000, 1) AS skuDescription,
            s.base_price AS basePrice,
            s.sale_price AS salePrice,
            s.is_serialized AS isSerialized,
            l.location_id AS locationId,
            l.section || ' > ' || l.aisle || ' > ' || l.bin AS locationPath,
            l.note AS locationNote,
            NVL(iu.individual_count, 0) AS individualQuantity,
            NVL(inv.inventory_quantity, 0) AS inventoryQuantity,
            NVL(iu.individual_count, 0) + NVL(inv.inventory_quantity, 0) AS totalQuantity
        FROM sku s
        JOIN product p ON s.product_id = p.product_id
        JOIN brand b ON p.brand_id = b.brand_id
        LEFT JOIN product_category pc ON p.product_id = pc.product_id
        LEFT JOIN category c ON pc.category_id = c.category_id
        JOIN location l ON l.location_id IN (
            SELECT DISTINCT current_location_id FROM individual_unit WHERE sku_id = s.sku_id
            UNION
            SELECT DISTINCT current_location_id FROM inventory WHERE sku_id = s.sku_id
        )
        LEFT JOIN (
            SELECT sku_id, current_location_id, COUNT(*) AS individual_count
            FROM individual_unit
            GROUP BY sku_id, current_location_id
        ) iu ON s.sku_id = iu.sku_id AND l.location_id = iu.current_location_id
        LEFT JOIN (
            SELECT sku_id, current_location_id, SUM(quantity) AS inventory_quantity
            FROM inventory
            GROUP BY sku_id, current_location_id
        ) inv ON s.sku_id = inv.sku_id AND l.location_id = inv.current_location_id
        WHERE (:skuCode IS NULL OR s.sku_code LIKE '%' || :skuCode || '%')
          AND (:locationSection IS NULL OR l.section LIKE '%' || :locationSection || '%')
        GROUP BY
            b.name, p.product_name, s.sku_code, DBMS_LOB.SUBSTR(s.description, 4000, 1),
            s.base_price, s.sale_price, s.is_serialized,
            l.location_id, l.section, l.aisle, l.bin, l.note,
            iu.individual_count, inv.inventory_quantity
        ORDER BY
            b.name ASC,
            s.sku_code ASC
        )
        """,
            nativeQuery = true)
    Page<InventoryViewProjection> findInventoryViewWithPagination(
            @Param("skuCode") String skuCode,
            @Param("locationSection") String locationSection,
            Pageable pageable);




}
