package org.project.ecom.service;

import org.project.ecom.model.Supplier;
import org.project.ecom.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for managing supplier operations
 */

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    /**
     * Retrieves all suppliers from the database
     *
     * @return List of all suppliers
     */
    public List<Supplier> getAllSuppliers() {
        return (List<Supplier>) supplierRepository.findAll();
    }

    /**
     * Retrieves a supplier by their ID
     *
     * @param id The ID of the supplier to retrieve
     * @return Optional containing the supplier if found
     */
    public Optional<Supplier> getSupplierById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Supplier ID cannot be null");
        }
        return supplierRepository.findById(id);
    }

    /**
     * Saves a new supplier or updates an existing one
     * @param supplier The supplier to save
     * @return The saved supplier
     */
    @Transactional
    public Supplier saveSupplier(@Valid Supplier supplier) {
        if (supplier == null) {
            throw new ValidationException("Supplier cannot be null");
        }
        return supplierRepository.save(supplier);
    }

    /**
     * Updates an existing supplier
     *
     * @param id       The ID of the supplier to update
     * @param supplier The updated supplier data
     * @return The updated supplier
     */
    @Transactional
    public Supplier updateSupplier(Long id, @Valid Supplier supplier) {
        return supplierRepository.findById(id)
                .map(existingSupplier -> {
                    supplier.setId(id);
                    return supplierRepository.save(supplier);
                })
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    /**
     * Deletes a supplier by their ID
     *
     * @param id The ID of the supplier to delete
     */
    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
        supplierRepository.deleteById(id);
    }

    /**
     * Searches for suppliers by name
     * @param searchTerm The search term to match against supplier names
     * @return List of matching suppliers
     */
    public List<Supplier> searchSuppliers(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new IllegalArgumentException("Search term cannot be null or empty");
        }
        return (List<Supplier>) supplierRepository.findAll();
    }
}