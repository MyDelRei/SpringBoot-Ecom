package org.project.ecom.repository;

import org.project.ecom.model.CheckoutProductNonserial;
import org.project.ecom.model.dto.CheckoutNonSerialDto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutNonSerialRepository extends JpaRepository<CheckoutProductNonserial,Long> {
}
