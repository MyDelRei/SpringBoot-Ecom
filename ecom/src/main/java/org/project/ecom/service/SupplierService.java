package org.project.ecom.service;

import org.project.ecom.model.Brand;
import org.project.ecom.model.Sku;
import org.project.ecom.model.Supplier;
import org.project.ecom.model.SupplierProduct;
import org.project.ecom.model.dto.*;
import org.project.ecom.repository.SkuRepository;
import org.project.ecom.repository.SupplierProductRepository;
import org.project.ecom.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.Reader;
import java.math.BigDecimal;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    
    private final SupplierRepository supplierRepository;
    private final SupplierProductRepository supplierProductRepository;
    private final SkuRepository skuRepository;
    
    @Autowired
    public SupplierService(SkuRepository skuRepository,SupplierRepository supplierRepository,SupplierProductRepository supplierProductRepository) {
        this.supplierRepository = supplierRepository;
        this.supplierProductRepository = supplierProductRepository;
        this.skuRepository = skuRepository;
    }
    
    
    //Create
    public Supplier saveSupplier(Supplier supplier){
        return supplierRepository.save(supplier);
    }

    //get all
    public List<Supplier> getAllSupplier(){
        return  supplierRepository.findAll();
    }

    //get id
    public Supplier getSupplierById(Long id){
        return supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
    }


    //update
    public void updateSupplier(Supplier model){
        Supplier Supplier = supplierRepository.findById(model.getId()).orElseThrow(() -> new RuntimeException("Supplier not found"));
        if(Supplier.getId()!=null){
            supplierRepository.save(model);
        }

    }

    //delete
    public void deleteBrand(Supplier model){
        Supplier Supplier = supplierRepository.findById(model.getId()).orElseThrow(() -> new RuntimeException("Brand not found"));

        if(Supplier.getId()!=null){
            supplierRepository.deleteById(model.getId());
        }
    }

    public void deleteSupplierProduct(Long Id){
        supplierProductRepository.deleteById(Id);
    }

    public List<SupplierProductDTO> getAllSuppliersWithProducts() {
        List<SupplierProductFlatDTO> flatList = supplierProductRepository.findAllSupplierProductFlat();

        Map<Long, SupplierProductDTO> map = new HashMap<>();

        for (SupplierProductFlatDTO flat : flatList) {
            SupplierProductDTO supplier = map.get(flat.getId());
            if (supplier == null) {
                supplier = SupplierProductDTO.builder()
                        .id(flat.getId())
                        .supplierName(flat.getSupplierName())
                        .email(flat.getEmail())
                        .phone(flat.getPhone())
                        .address(flat.getAddress())
                        .products(new ArrayList<>())
                        .build();
                map.put(flat.getId(), supplier);
            }

            if (flat.getSupplierProductId() != null) {
                SupplierProductDTO.ProductInfo product = SupplierProductDTO.ProductInfo.builder()
                        .supplierProductId(flat.getSupplierProductId())
                        .leadTimeDays(flat.getLeadTimeDays())
                        .costPrice(flat.getCostPrice())
                        .status(flat.getStatus())
                        .skuId(flat.getSkuId())
                        .skuCode(flat.getSkuCode())
                        .skuDescription(flat.getSkuDescription())
                        .productId(flat.getProductId())
                        .productName(flat.getProductName())
                        .build();

                supplier.getProducts().add(product);
            }
        }

        return new ArrayList<>(map.values());
    }

    public List<SupplierResponseDto> getAllSupplierDtos() {
        List<Supplier> suppliers = supplierRepository.findAll();

        return suppliers.stream()
                .map(SupplierResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<SupplierProduct> createSupplierProducts(List<SupplierProductRequestDto> dtos) {
        // can use stream or for each loop
        List<SupplierProduct> entities = dtos.stream()
                .map(dto -> {

                    SupplierProduct sp = new SupplierProduct();

                    Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                            .orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + dto.getSupplierId()));


                    Sku sku = skuRepository.findById(dto.getSkuId())
                            .orElseThrow(() -> new RuntimeException("SKU not found with ID: " + dto.getSkuId()));

                    sp.setSupplier(supplier);
                    sp.setSku(sku);
                    sp.setLeadTimeDays(Long.valueOf(dto.getLeadTimeDays()));
                    sp.setCostPrice(dto.getCostPrice());
                    sp.setStatus(dto.getStatus());
                    return sp;
                })
                .collect(Collectors.toList());

        return supplierProductRepository.saveAll(entities);
    }



    public SupplierProductDTO getSupplierWithProducts(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        List<SupplierProduct> supplierProducts = supplierProductRepository.findBySupplierId(supplierId);

        List<SupplierProductDTO.ProductInfo> productInfos = supplierProducts.stream().map(sp -> {
            Sku sku = sp.getSku(); // or getProduct() depending on your model
            return SupplierProductDTO.ProductInfo.builder()
                    .supplierProductId(sp.getSupplierProductId())
                    .leadTimeDays(sp.getLeadTimeDays())
                    .costPrice(sp.getCostPrice())
                    .status(sp.getStatus())
                    .skuId(sku.getSkuId())
                    .skuCode(sku.getSkuCode())
                    .skuDescription(sku.getDescription())
                    .productId(sku.getProduct().getProductId())
                    .productName(sku.getProduct().getProductName())
                    .build();
        }).toList();

        return SupplierProductDTO.builder()
                .id(supplier.getId())
                .supplierName(supplier.getSupplierName())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .products(productInfos)
                .build();
    }


    public SupplierWithProductsDto getSupplierWithProductsAtt(Long supplierId) {
        List<Object[]> rows = supplierProductRepository.findSupplierWithProductsRaw(supplierId);

        if (rows.isEmpty()) return null;

        SupplierWithProductsDto dto = new SupplierWithProductsDto();
        Map<Long, SupplierWithProductsDto.SkuDto> skuMap = new HashMap<>();

        for (Object[] row : rows) {
            Long sId = ((Number) row[0]).longValue();
            String sName = safeCastToString(row[1]);
            String email = safeCastToString(row[2]);
            String phone = safeCastToString(row[3]);
            String address = clobToString(row[4]);

            Long skuId = ((Number) row[5]).longValue();
            String skuCode = safeCastToString(row[6]);
            BigDecimal basePrice = (BigDecimal) row[7];
            BigDecimal salePrice = (BigDecimal) row[8];
            String isSerialized = safeCastToString(row[9]);

            Long productId = ((Number) row[10]).longValue();
            String productName = safeCastToString(row[11]);

            Long attributeId = row[12] != null ? ((Number) row[12]).longValue() : null;
            String attributeName = safeCastToString(row[13]);
            String unit = safeCastToString(row[14]);
            String value = safeCastToString(row[15]);

            if (dto.getSupplierId() == null) {
                dto.setSupplierId(sId);
                dto.setSupplierName(sName);
                dto.setEmail(email);
                dto.setPhone(phone);
                dto.setAddress(address);
                dto.setSkus(new ArrayList<>());
            }

            SupplierWithProductsDto.SkuDto skuDto = skuMap.get(skuId);
            if (skuDto == null) {
                skuDto = new SupplierWithProductsDto.SkuDto();
                skuDto.setSkuId(skuId);
                skuDto.setSkuCode(skuCode);
                skuDto.setBasePrice(basePrice);
                skuDto.setSalePrice(salePrice);
                skuDto.setIsSerialized(isSerialized);

                SupplierWithProductsDto.ProductDto productDto = new SupplierWithProductsDto.ProductDto();
                productDto.setProductId(productId);
                productDto.setProductName(productName);
                skuDto.setProduct(productDto);

                skuDto.setAttributes(new ArrayList<>());
                dto.getSkus().add(skuDto);
                skuMap.put(skuId, skuDto);
            }

            if (attributeId != null) {
                SupplierWithProductsDto.AttributeDto attr = new SupplierWithProductsDto.AttributeDto();
                attr.setAttributeId(attributeId);
                attr.setAttributeName(attributeName);
                attr.setUnitOfMeasure(unit);
                attr.setAttributeValue(value);
                skuDto.getAttributes().add(attr);
            }
        }

        return dto;
    }


    private String clobToString(Object clobObj) {
        if (clobObj == null) return null;
        if (!(clobObj instanceof Clob)) return safeCastToString(clobObj);

        Clob clob = (Clob) clobObj;
        try (Reader reader = clob.getCharacterStream()) {
            StringBuilder sb = new StringBuilder();
            char[] buffer = new char[2048];
            int bytesRead;
            while ((bytesRead = reader.read(buffer)) != -1) {
                sb.append(buffer, 0, bytesRead);
            }
            return sb.toString();
        } catch (SQLException | IOException e) {
            throw new RuntimeException("Failed to read CLOB", e);
        }
    }

    private String safeCastToString(Object obj) {
        if (obj == null) return null;
        if (obj instanceof String) return (String) obj;
        return obj.toString();
    }












}
