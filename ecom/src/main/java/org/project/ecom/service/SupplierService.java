package org.project.ecom.service;

import org.project.ecom.model.Supplier;
import org.project.ecom.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    //select all

    //select 1

    //update

    //delete



}
