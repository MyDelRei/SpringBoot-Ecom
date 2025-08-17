package org.project.ecom.repository;

import org.project.ecom.model.Sku;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface SkuRepository extends JpaRepository<Sku, Long> {
    Optional<Sku> findBySkuCode(String skuCode);
}
