package org.project.ecom.repository;

import org.project.ecom.model.Sku;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface SkuRepository extends JpaRepository<Sku, Long> {
}
