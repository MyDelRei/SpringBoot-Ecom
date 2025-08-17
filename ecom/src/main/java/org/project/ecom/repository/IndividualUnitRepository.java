package org.project.ecom.repository;

import org.project.ecom.model.IndividualUnit;
import org.project.ecom.model.dto.ArrivalSkuDetailsDTO;
import org.project.ecom.model.dto.ArrivalSkuProjection;
import org.project.ecom.model.dto.CheckOutSnProjection;
import org.project.ecom.model.dto.IndividualUnitDetailProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IndividualUnitRepository extends JpaRepository<IndividualUnit, Long> {

    @Query(
            value = """
            SELECT 
                pa.arrival_id AS arrivalId,
                s.sku_id AS skuId,
                s.sku_code AS skuCode
            FROM Product_Item_Arrival pia
            JOIN Product_Arrival pa 
                ON pia.arrival_id = pa.arrival_id
            JOIN Purchase_Request pr 
                ON pa.request_id = pr.request_id
            JOIN sku s
                ON pia.sku_id = s.sku_id
            WHERE LOWER(pr.status) = LOWER(:status)
            """,
            nativeQuery = true
    )
    List<ArrivalSkuProjection> findArrivalSkuByStatus(@Param("status") String status);

    @Query(value = """
    SELECT
        pia.sku_id AS skuId,
        s.sku_code AS skuCode,
        pia.quantity_received AS quantityReceived,
        TRUNC(pa.arrival_date) AS arrivalDate
    FROM product_item_arrival pia
    JOIN product_arrival pa ON pia.arrival_id = pa.arrival_id
    JOIN sku s ON pia.sku_id = s.sku_id
    WHERE pia.arrival_id = :arrivalId
    """, nativeQuery = true)
    List<ArrivalSkuDetailsDTO> findDetailsByArrivalId(@Param("arrivalId") Long arrivalId);


    @Query("SELECT COUNT(i) FROM IndividualUnit i " +
            "WHERE i.arrival.id = :arrivalId AND i.sku.skuId = :skuId")
    Long countByArrivalIdAndSkuId(@Param("arrivalId") Long arrivalId,
                                  @Param("skuId") Long skuId);


    @Query(value = """
    WITH sku_attributes AS (
        SELECT
            sa.sku_id,
            LISTAGG(a.attribute_name || ': ' || sa.attribute_value, ', ') WITHIN GROUP (ORDER BY a.attribute_name) AS attributes
        FROM sku_attribute sa
        JOIN attribute a ON sa.attribute_id = a.attribute_id
        GROUP BY sa.sku_id
    )
    SELECT
        s.sku_id AS skuId,
        s.sku_code AS skuCode,
        s.sale_price AS salePrice,
        p.product_name AS productName,
        attrs.attributes AS attributes,
        iu.serial_number AS serialNumber,
        l.section AS section,
        l.aisle AS aisle,
        l.bin AS bin,
        l.note AS note
    FROM individual_unit iu
    JOIN sku s ON iu.sku_id = s.sku_id
    JOIN product p ON s.product_id = p.product_id
    LEFT JOIN sku_attributes attrs ON s.sku_id = attrs.sku_id
    JOIN location l ON iu.current_location_id = l.location_id
    WHERE LOWER(p.product_name) LIKE LOWER('%' || :searchTerm || '%')
       OR LOWER(s.sku_code) LIKE LOWER('%' || :searchTerm || '%')
       OR LOWER(iu.serial_number) LIKE LOWER('%' || :searchTerm || '%')
    """,
            countQuery = """
    SELECT COUNT(*)
    FROM individual_unit iu
    JOIN sku s ON iu.sku_id = s.sku_id
    JOIN product p ON s.product_id = p.product_id
    JOIN location l ON iu.current_location_id = l.location_id
    WHERE LOWER(p.product_name) LIKE LOWER('%' || :searchTerm || '%')
       OR LOWER(s.sku_code) LIKE LOWER('%' || :searchTerm || '%')
       OR LOWER(iu.serial_number) LIKE LOWER('%' || :searchTerm || '%')
    """,
            nativeQuery = true)
    Page<IndividualUnitDetailProjection> findAllIndividualUnitDetails(@Param("searchTerm") String searchTerm, Pageable pageable);




    Optional<IndividualUnit> findBySerialNumber(String serialNumber);


    @Query(value = "SELECT " +
            "s.sku_code AS sku, " +
            "iu.serial_number AS serialNumber, " +
            "1 AS qty, " +
            "l.section || ' > ' || l.aisle || ' > ' || l.bin AS location " +
            "FROM Individual_Unit iu " +
            "JOIN Sku s ON iu.sku_id = s.sku_id " +
            "JOIN Location l ON iu.current_location_id = l.location_id " +
            "WHERE iu.serial_number = :serialNumber",
            nativeQuery = true)
    List<CheckOutSnProjection> findByCheckOutSerialNumber(@Param("serialNumber") String serialNumber);
}
