package org.project.ecom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface SupplierPaymentInvoiceRepository extends JpaRepository<org.project.ecom.model.SupplierPaymentInvoice, Long> {

    @Query("SELECT MAX(spi.invoiceNumber) FROM SupplierPaymentInvoice spi WHERE spi.invoiceDate = :today")
    Long findLatestInvoiceNumberForToday(@Param("today") LocalDate today);

}
