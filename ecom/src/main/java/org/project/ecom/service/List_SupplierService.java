package org.project.ecom.service;

import org.project.ecom.model.List_Supplier;
import org.project.ecom.model.Supplier;
import org.project.ecom.repository.List_SupplierRepository;
import org.project.ecom.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class List_SupplierService {

    private final List_SupplierRepository listSupplierRepository;
    private final SupplierRepository supplierRepository;

    @Autowired
    public List_SupplierService(List_SupplierRepository listSupplierRepository, SupplierRepository supplierRepository) {
        this.listSupplierRepository = listSupplierRepository;
        this.supplierRepository = supplierRepository;
    }

    public List_Supplier addSupplier(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        List_Supplier listSupplier = new List_Supplier();
        listSupplier.setId(supplierId);
        listSupplier.setCreatedAt(LocalDateTime.now());
        listSupplier.setUpdatedAt(LocalDateTime.now());

        return listSupplierRepository.save(listSupplier);
    }

    public Optional<List_Supplier> getById(Long id) {
        return listSupplierRepository.findById(id);
    }

    public List<List_Supplier> getAll() {
        return (List<List_Supplier>) listSupplierRepository.findAll();
    }

    public void delete(Long id) {
        listSupplierRepository.deleteById(id);
    }

    public List_Supplier update(List_Supplier listSupplier) {
        return listSupplierRepository.findById(listSupplier.getId())
                .map(existing -> {
                    existing.setUpdatedAt(LocalDateTime.now());
                    return listSupplierRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("List_Supplier not found"));
    }
}
