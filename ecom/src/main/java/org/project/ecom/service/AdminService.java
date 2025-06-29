package org.project.ecom.service;


import org.project.ecom.model.Brand;
import org.project.ecom.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    BrandRepository brandRepository;

   public List<Brand> getAllBrand(){
       return (List<Brand>) brandRepository.findAll();
   }

   public Brand getBrandById(Long id){
       return brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found"));
   }

   public Brand createBrand(Brand model){
       return brandRepository.save(model);
   }

   public void updateBrand(Brand model){
       Brand brandModel = brandRepository.findById(model.getBrandId()).orElseThrow(() -> new RuntimeException("Brand not found"));
       if(brandModel.getBrandId()!=null){
           brandRepository.save(model);
       }

   }
   public void deleteBrand(Brand model){
       Brand brandModel = brandRepository.findById(model.getBrandId()).orElseThrow(() -> new RuntimeException("Brand not found"));

       if(brandModel.getBrandId()!=null){
           brandRepository.deleteById(model.getBrandId());
       }
   }



}
