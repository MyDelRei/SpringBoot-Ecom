package org.project.ecom.repository;

import org.project.ecom.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
