package org.project.ecom.repository;

import org.project.ecom.model.SupplierPaymentInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SupplierPaymentInvoiceRepository extends JpaRepository<org.project.ecom.model.SupplierPaymentInvoice, Long> {

    @Query("SELECT MAX(spi.invoiceNumber) FROM SupplierPaymentInvoice spi WHERE spi.invoiceDate = :today")
    Long findLatestInvoiceNumberForToday(@Param("today") LocalDate today);


    @Query("SELECT spi.invoiceNumber FROM SupplierPaymentInvoice spi")
    List<Long> findAllInvoiceNumbers();

            @Query("SELECT sp.request.id " +
                   "FROM SupplierPaymentInvoice spi " +
                   "JOIN spi.payment sp " +
                    "WHERE spi.invoiceNumber = :invoiceNumber")
    Long findWithPaymentAndRequestByInvoiceNumber(@Param("invoiceNumber") Long invoiceNumber);
 }
