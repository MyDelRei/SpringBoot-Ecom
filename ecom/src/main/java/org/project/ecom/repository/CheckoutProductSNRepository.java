package org.project.ecom.repository;

import org.project.ecom.model.CheckoutProductSn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CheckoutProductSNRepository extends JpaRepository<CheckoutProductSn, Long> {
    Optional<CheckoutProductSn> findBySerialNumber(String serialNumber);
}