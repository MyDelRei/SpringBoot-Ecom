package org.project.ecom.repository;

import org.project.ecom.model.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ImagesRepository extends JpaRepository<Images, Long> {
    List<Images> findByProductProductId(Long productId);
}
