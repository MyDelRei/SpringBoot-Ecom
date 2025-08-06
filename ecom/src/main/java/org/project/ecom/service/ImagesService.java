package org.project.ecom.service;

import org.project.ecom.model.*;
import org.project.ecom.model.dto.ImageDTO;
import org.project.ecom.model.dto.ImageUploadDto;
import org.project.ecom.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImagesService {

    private final ImagesRepository imageRepository;
    private final ProductRepository productRepository; // To link image to product

    @Autowired
    public ImagesService(ImagesRepository imageRepository, ProductRepository productRepository) {
        this.imageRepository = imageRepository;
        this.productRepository = productRepository;
    }


    @Transactional
    public List<Images> createImages(Long productId, List<Images> images) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        for (Images image : images) {
            image.setProduct(product);
        }

        return imageRepository.saveAll(images);
    }

    public Optional<Images> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    public List<Images> getImagesByProductId(Long productId) {
        return imageRepository.findByProductProductId(productId);
    }
//
//    @Transactional
//    public List<Images> updateImages(Long productId, List<Images> imageList) {
//        Product product = productRepository.findById(productId)
//                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
//
//        List<Images> updatedImages = new ArrayList<>();
//
//        for (Images imageDetails : imageList) {
//            Long imageId = imageDetails.getImageId();
//            Images existingImage = imageRepository.findById(imageId)
//                    .orElseThrow(() -> new RuntimeException("Image not found with ID: " + imageId));
//
//            existingImage.setProduct(product);
//            existingImage.setImageBytes(imageDetails.getImageBytes());
//            existingImage.setAltText(imageDetails.getAltText());
//            existingImage.setDisplayOrder(imageDetails.getDisplayOrder());
//
//            updatedImages.add(existingImage);
//        }
//
//        return imageRepository.saveAll(updatedImages);
//    }

    @Transactional
    public List<Images> updateImages(Long productId, List<Images> imageList) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        List<Images> updatedImages = new ArrayList<>();

        for (Images imageDetails : imageList) {
            Images image;

            // If imageId is present, update the existing one
            if (imageDetails.getImageId() != null) {
                image = imageRepository.findById(imageDetails.getImageId())
                        .orElseThrow(() -> new RuntimeException("Image not found with ID: " + imageDetails.getImageId()));
            } else {
                // Otherwise, create a new image
                image = new Images();
            }

            image.setProduct(product);
            image.setImageBytes(imageDetails.getImageBytes());
            image.setAltText(imageDetails.getAltText());
            image.setDisplayOrder(imageDetails.getDisplayOrder());

            updatedImages.add(image);
        }

        return imageRepository.saveAll(updatedImages);
    }



    @Transactional
    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }

    @Transactional
    public List<Images> createImages(ImageUploadDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<Images> images = dto.getImages().stream()
                .map(this::mapToImage)
                .collect(Collectors.toList());

        images.forEach(img -> img.setProduct(product));

        return imageRepository.saveAll(images);
    }

    private Images mapToImage(ImageDTO dto) {
        Images image = new Images();
        image.setAltText(dto.getAltText());
        image.setDisplayOrder(dto.getDisplayOrder());
        if (dto.getImageBase64() != null && !dto.getImageBase64().isEmpty()) {
            // Strip off the prefix "data:image/png;base64," if present
            String base64Data = dto.getImageBase64();
            if (base64Data.contains(",")) {
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }

            byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Data);
            image.setImageBytes(imageBytes);
        }

        return image;
    }

}