package org.project.ecom.service;

import org.project.ecom.model.*;
import org.project.ecom.model.dto.ImageDTO;
import org.project.ecom.model.dto.ProductListDTO;
import org.project.ecom.model.dto.ProductRequestDto;
import org.project.ecom.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, BrandRepository brandRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Product createProduct(Product product) {
        // ✅ Lookup Brand by Name
        if (product.getBrand() != null && product.getBrand().getName() != null) {
            Brand brand = brandRepository.findByName(product.getBrand().getName())
                    .orElseThrow(() -> new RuntimeException("Brand not found with name: " + product.getBrand().getName()));
            product.setBrand(brand);
        }

        // ✅ Category lookup by name
        if (product.getProductCategories() != null) {
            product.getProductCategories().forEach(pc -> {
                pc.setProduct(product);

                if (pc.getCategory() != null && pc.getCategory().getName() != null) {
                    Category category = categoryRepository.findByName(pc.getCategory().getName())
                            .orElseThrow(() -> new RuntimeException("Category not found with name: " + pc.getCategory().getName()));
                    pc.setCategory(category);
                }
            });
        }

        return productRepository.save(product);
    }


    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

        existingProduct.setProductName(productDetails.getProductName());
        existingProduct.setDescription(productDetails.getDescription());

        if (productDetails.getBrand() != null && productDetails.getBrand().getBrandId() != null) {
            Brand brand = brandRepository.findById(productDetails.getBrand().getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + productDetails.getBrand().getBrandId()));
            existingProduct.setBrand(brand);
        }

        // Images are NOT handled here anymore
        // existingProduct.getImages().clear();
        // productDetails.getImages().forEach(newImage -> {
        //     newImage.setProduct(existingProduct);
        //     existingProduct.getImages().add(newImage);
        // });

        if (productDetails.getProductCategories() != null) {
            existingProduct.getProductCategories().clear();
            productDetails.getProductCategories().forEach(newPc -> {
                newPc.setProduct(existingProduct);
                if (newPc.getCategory() != null && newPc.getCategory().getCategoryId() != null) {
                    Category category = categoryRepository.findById(newPc.getCategory().getCategoryId())
                            .orElseThrow(() -> new RuntimeException("Category not found with ID: " + newPc.getCategory().getCategoryId()));
                    newPc.setCategory(category);
                }
                existingProduct.getProductCategories().add(newPc);
            });
        }

        return productRepository.save(existingProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // GET DTO

    public List<ProductListDTO> getAllProductDTOs() {
        return productRepository.findAll().stream().map(product -> {
            ProductListDTO dto = new ProductListDTO();
            dto.setProductId(product.getProductId());
            dto.setProductName(product.getProductName());
            dto.setDescription(product.getDescription());
            dto.setBrandName(product.getBrand().getName());
            dto.setCategoryName(product.getProductCategories().getFirst().getCategory().getName());

            List<ImageDTO> imageDTOs = product.getImages().stream().map(image -> {
                ImageDTO imageDTO = new ImageDTO();
                imageDTO.setImageId(image.getImageId());
                imageDTO.setAltText(image.getAltText());
                imageDTO.setDisplayOrder(image.getDisplayOrder());
                imageDTO.setImageBase64(Base64.getEncoder().encodeToString(image.getImageBytes()));
                return imageDTO;
            }).collect(Collectors.toList());

            dto.setImages(imageDTOs);

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Product createProductFromDto(ProductRequestDto dto) {
        Product product = new Product();
        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());

        Brand brand = brandRepository.findByName(dto.getBrandName())
                .orElseThrow(() -> new RuntimeException("Brand not found with name: " + dto.getBrandName()));
        product.setBrand(brand);

        // Convert category names to ProductCategory entities
        List<ProductCategory> productCategories = dto.getCategoryNames().stream().map(catName -> {
            Category category = categoryRepository.findByName(catName)
                    .orElseThrow(() -> new RuntimeException("Category not found with name: " + catName));
            ProductCategory pc = new ProductCategory();
            pc.setProduct(product);
            pc.setCategory(category);
            return pc;
        }).collect(Collectors.toList());

        product.setProductCategories(productCategories);

        return productRepository.save(product);
    }
}