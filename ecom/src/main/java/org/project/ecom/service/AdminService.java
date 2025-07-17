package org.project.ecom.service;


import org.project.ecom.model.Brand;
import org.project.ecom.model.Category;
import org.project.ecom.repository.BrandRepository;
import org.project.ecom.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    BrandRepository brandRepository;

    @Autowired
    CategoryRepository categoryRepository;


    // == == == == == == == == == == CATEGORY SERVICE == == == == == == == == == == == ==
    // get all categories
    public List<Category> getAllCategory(){
        return (List<Category>) categoryRepository.findAll();
    }
    // get category by id
    public Category getCategoryById(Long id){
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    }
    // create category
    public Category createCategory(Category model){
        return categoryRepository.save(model);
    }
    // update category
    public void updateCategory(Category model){
        Category categoryModel = categoryRepository.findById(model.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found"));
        if(categoryModel.getCategoryId()!=null){
            categoryRepository.save(model);
        }
    }
    // delete category
    public void deleteCategory(Category model){
        Category categoryModel = categoryRepository.findById(model.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found"));
        if (categoryModel.getCategoryId()!=null){
            categoryRepository.deleteById(model.getCategoryId());
        }
    }
    // == == == == == == == == == == BRANDS SERVICE == == == == == == == == == == == ==

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
