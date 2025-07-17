package org.project.ecom.repository;

import org.project.ecom.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
}
