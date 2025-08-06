package org.project.ecom.repository;

import org.project.ecom.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
