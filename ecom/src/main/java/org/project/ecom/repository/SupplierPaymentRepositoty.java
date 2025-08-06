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

}
