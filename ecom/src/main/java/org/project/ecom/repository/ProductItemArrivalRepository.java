package org.project.ecom.repository;

import org.project.ecom.model.ProductItemArrival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductItemArrivalRepository extends JpaRepository<ProductItemArrival, Long> {
    List<ProductItemArrival> findByArrivalId(Long arrivalId);

}