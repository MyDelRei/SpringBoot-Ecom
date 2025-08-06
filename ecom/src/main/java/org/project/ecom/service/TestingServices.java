package org.project.ecom.service;

import org.project.ecom.model.Product;
import org.project.ecom.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestingServices {

    @Autowired
    ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return (List<Product>) productRepository.findAll();
    }
}
