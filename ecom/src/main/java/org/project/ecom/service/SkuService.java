package org.project.ecom.service;

import org.project.ecom.model.Sku;
import org.project.ecom.model.dto.SkuResponseDto;
import org.project.ecom.repository.SkuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class SkuService {

    private final SkuRepository skuRepository;

    @Autowired
    public SkuService(SkuRepository skuRepository) {
        this.skuRepository = skuRepository;
    }

    public Sku saveSku(Sku sku) {
        return skuRepository.save(sku);
    }




    public Optional<Sku> getSkuById(Long id) {
        return skuRepository.findById(id);
    }


    public List<Sku> getAllSkus() {
        return skuRepository.findAll();
    }


    public void deleteSku(Sku model) {

        skuRepository.deleteById(model.getSkuId());
    }



    public Sku updateSku(Sku updatedSku) {
        return skuRepository.findById(updatedSku.getSkuId()).map(existingSku -> {

            existingSku.setSkuCode(updatedSku.getSkuCode());
            existingSku.setDescription(updatedSku.getDescription());
            existingSku.setBasePrice(updatedSku.getBasePrice());
            existingSku.setSalePrice(updatedSku.getSalePrice());
            existingSku.setIsSerialized(updatedSku.getIsSerialized());

            existingSku.setProduct(updatedSku.getProduct());
            return skuRepository.save(existingSku);
        }).orElseThrow(()-> new RuntimeException("Sku not found"));
    }


    // __________________________ DTO ______________________________-
    public List<SkuResponseDto> getAllSkuDTOs() {
        List<Sku> skus = skuRepository.findAll();

        return skus.stream().map(sku -> SkuResponseDto.builder()
                .skuId(sku.getSkuId())
                .skuCode(sku.getSkuCode())
                .description(sku.getDescription())
                .productId(sku.getProduct().getProductId())
                .productName(sku.getProduct().getProductName())
                .basePrice(sku.getBasePrice())
                .salePrice(sku.getSalePrice())
                .isSerialized(sku.getIsSerialized())
                .createdAt(sku.getCreatedAt())
                .updatedAt(sku.getUpdatedAt())
                .build()
        ).collect(Collectors.toList());
    }
}
