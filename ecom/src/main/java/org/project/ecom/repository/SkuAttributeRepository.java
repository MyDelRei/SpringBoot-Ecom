package org.project.ecom.repository;

import org.project.ecom.model.SkuAttribute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface SkuAttributeRepository extends JpaRepository<SkuAttribute, Long> {

    void deleteByGroupId(Long groupId);

    List<SkuAttribute> groupId(Long groupId);


    Optional<SkuAttribute> findBySku_SkuIdAndAttribute_AttributeId(Long skuId, Long attributeId);




}
