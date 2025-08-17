package org.project.ecom.repository;

import org.project.ecom.model.CheckoutProductNonserial;
import org.project.ecom.model.dto.CheckoutNonSerialDto;
import org.project.ecom.model.dto.RecentCheckoutProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CheckoutNonSerialRepository extends JpaRepository<CheckoutProductNonserial,Long> {
    @Query(
            value = "SELECT * FROM ( " +
                    "SELECT checkout_id, sku, 1 AS quantity, serial_number AS serial_number, CAST(created_at AS TIMESTAMP) AS created_at, 'serial' AS type " +
                    "FROM Checkout_Product_SN " +
                    "UNION ALL " +
                    "SELECT checkout_id, sku, quantity, NULL AS serial_number, CAST(created_at AS TIMESTAMP) AS created_at, 'non-serial' AS type " +
                    "FROM Checkout_Product_NonSerial " +
                    "ORDER BY created_at DESC " +
                    ") WHERE ROWNUM <= 10",
            nativeQuery = true
    )
    List<RecentCheckoutProjection> findRecentCheckouts();

}
