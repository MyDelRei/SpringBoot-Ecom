package org.project.ecom.repository;

import org.project.ecom.model.Supplier;
import org.project.ecom.model.SupplierProduct;
import org.project.ecom.model.dto.SupplierProductDTO;
import org.project.ecom.model.dto.SupplierProductFlatDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierProductRepository extends JpaRepository<SupplierProduct, Long> {

    @Query("SELECT new org.project.ecom.model.dto.SupplierProductFlatDTO(" +
            "s.id, s.supplierName, s.email, s.phone, s.address, " +
            "sp.supplierProductId, sp.leadTimeDays, sp.costPrice, sp.status, " +
            "sku.skuId, sku.skuCode, sku.description, " +
            "p.productId, p.productName) " +
            "FROM Supplier s " +
            "LEFT JOIN s.supplierProducts sp " +
            "LEFT JOIN sp.sku sku " +
            "LEFT JOIN sku.product p")
    List<SupplierProductFlatDTO> findAllSupplierProductFlat();


    List<SupplierProduct> findBySupplierId(Long supplierId);

    @Query(value = """
    SELECT
        s.supplier_id,
        s.supplier_name,
        s.email,
        s.phone,
        s.address,

        sku.sku_id,
        sku.sku_code,
        sku.base_price,
        sku.sale_price,
        sku.is_serialized,

        p.product_id,
        p.product_name,

        a.attribute_id,
        a.attribute_name,
        a.unit_of_measure,
        sa.attribute_value

    FROM Supplier s
    INNER JOIN Supplier_Product sp ON s.supplier_id = sp.supplier_id
    INNER JOIN SKU sku ON sp.sku_id = sku.sku_id
    INNER JOIN Product p ON sku.product_id = p.product_id
    LEFT JOIN SKU_ATTRIBUTE sa ON sku.sku_id = sa.sku_id
    LEFT JOIN ATTRIBUTE a ON sa.attribute_id = a.attribute_id
    WHERE s.supplier_id = :supplierId
    ORDER BY s.supplier_name, sku.sku_code, a.attribute_name
    """, nativeQuery = true)
    List<Object[]> findSupplierWithProductsRaw(@Param("supplierId") Long supplierId);












}
