package org.project.ecom.repository;

import org.project.ecom.model.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierPaymentRepositoty extends JpaRepository<SupplierPayment, Long> {

    @Query(value = """
        SELECT
            s.supplier_id,
            s.supplier_name,
            pr.status AS status,
            spm.spm_id,
            spm.payment_type,
            spm.bank,
            spm.account_number,
            spm.qr_img
        FROM Purchase_Request pr
        JOIN Supplier s ON s.supplier_id = pr.supplier_id
        LEFT JOIN SUPPLIER_PAYMENT_METHOD spm ON spm.supplier_id = s.supplier_id
        WHERE pr.request_id = :requestId
          AND pr.status IN ('approved', 'pending')
        """, nativeQuery = true)
    List<Object[]> getSupplierPaymentRawRows(@Param("requestId") Long requestId);

    @Query(value = """

            SELECT
        pr.request_id,
        s.supplier_id,
        s.supplier_name,
        spi.invoice_number,
        sp.amount,
        pr.status AS request_status,
        spm.payment_type,
        sp.payment_date,
        sk.sku_code,
        p.product_name,
        pi.quantity_request,
        sk.base_price
    FROM Supplier s
    JOIN Purchase_Request pr ON s.supplier_id = pr.supplier_id
    JOIN Supplier_Payment sp ON pr.request_id = sp.request_id
    JOIN Supplier_Payment_Invoice spi ON sp.payment_id = spi.payment_id
    JOIN Supplier_Payment_Method spm ON sp.spm_id = spm.spm_id
    JOIN Purchase_Item pi ON pr.request_id = pi.request_id
    JOIN Sku sk ON pi.sku_id = sk.sku_id
    JOIN Product p ON sk.product_id = p.product_id
    ORDER BY pr.request_id, sk.sku_code
    
    """, nativeQuery = true)
    List<Object[]> getAllSupplierPurchaseDetailsRaw();


}
