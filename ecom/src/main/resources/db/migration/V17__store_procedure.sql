
CREATE OR REPLACE PROCEDURE get_inventory_view(
    p_search IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
OPEN p_cursor FOR
SELECT
    b.name AS brand_name,
    p.product_name,
    LISTAGG(c.name, ', ') WITHIN GROUP (ORDER BY c.name) AS categories,
            s.sku_code,
            DBMS_LOB.SUBSTR(s.description, 4000, 1) AS sku_description,
            s.base_price,
            s.sale_price,
            s.is_serialized,
            l.location_id,
            l.section || ' > ' || l.aisle || ' > ' || l.bin AS location_path,
            l.note AS location_note,
            NVL(iu.individual_count, 0) AS individual_quantity,
            NVL(inv.inventory_quantity, 0) AS inventory_quantity,
            NVL(iu.individual_count, 0) + NVL(inv.inventory_quantity, 0) AS total_quantity
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
WHERE (p_search IS NULL OR LOWER(s.sku_code) LIKE '%' || LOWER(p_search) || '%' OR LOWER(p.product_name) LIKE '%' || LOWER(p_search) || '%')
GROUP BY
    b.name, p.product_name, s.sku_code, DBMS_LOB.SUBSTR(s.description, 4000, 1),
    s.base_price, s.sale_price, s.is_serialized,
    l.location_id, l.section, l.aisle, l.bin, l.note,
    iu.individual_count, inv.inventory_quantity
ORDER BY
    b.name, p.product_name, s.sku_code, location_path
    FETCH FIRST 500 ROWS ONLY;
END get_inventory_view;
/
