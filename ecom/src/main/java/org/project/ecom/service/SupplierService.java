package org.project.ecom.service;

import jakarta.validation.Valid;
import org.project.ecom.model.Attribute;
import org.project.ecom.model.Supplier;
import org.project.ecom.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    
    private final SupplierRepository supplierRepository;
    
    @Autowired
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }
    
    
    //Create
    public Supplier saveSupplier(Supplier supplier){
        return supplierRepository.save(supplier);
    }
//    get all supplier
        public List<Supplier> getAllSupplier(){
        return (List<Supplier>) supplierRepository.findAll();
        }
    //get by id
    public Supplier getSublierById( Long id){
        return supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("supplier not found"));
    }
    //select 1

    //update
    public void updateSupplier(Supplier model) {
        supplierRepository.findById(model.getId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplierRepository.save(model);
    }

    //delete
    public void deleteSupplier(Supplier model) {
        supplierRepository.findById(model.getId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplierRepository.deleteById(model.getId());
    }




}
