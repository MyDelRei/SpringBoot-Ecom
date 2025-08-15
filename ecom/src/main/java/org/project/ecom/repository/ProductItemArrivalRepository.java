package org.project.ecom.repository;

import org.project.ecom.model.ProductItemArrival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductItemArrivalRepository extends JpaRepository<ProductItemArrival, Long> {
    @Query("SELECT p.quantityReceived FROM ProductItemArrival p " +
            "WHERE p.arrival.id = :arrivalId AND p.sku.skuId = :skuId")
    Optional<Integer> findQuantityReceivedByArrivalIdAndSkuId(@Param("arrivalId") Long arrivalId,
                                                              @Param("skuId") Long skuId);
}
