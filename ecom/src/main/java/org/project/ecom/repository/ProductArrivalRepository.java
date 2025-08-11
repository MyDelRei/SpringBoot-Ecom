package org.project.ecom.repository;

import org.project.ecom.model.ProductArrival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductArrivalRepository extends JpaRepository<ProductArrival, Long> {
}
