package org.project.ecom.repository;

import org.project.ecom.model.SupplierPaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierPaymentMethodRepository extends JpaRepository<SupplierPaymentMethod,Long> {
}
