package org.project.ecom.service;

import lombok.RequiredArgsConstructor;
import org.project.ecom.model.Supplier;
import org.project.ecom.model.SupplierPaymentMethod;
import org.project.ecom.model.dto.SupplierPaymentMethodRequestDTO;
import org.project.ecom.model.dto.SupplierPaymentMethodResponseDTO;
import org.project.ecom.repository.SupplierPaymentMethodRepository;
import org.project.ecom.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class SupplierPaymentMethodService {

    private final SupplierPaymentMethodRepository spmRepo;
    private final SupplierRepository supplierRepo;

    public void create(SupplierPaymentMethodRequestDTO dto) {
        Supplier supplier = supplierRepo.findById(dto.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));

        SupplierPaymentMethod spm = new SupplierPaymentMethod();
        spm.setSupplier(supplier);
        spm.setPaymentType(dto.getPaymentType());   // <-- fixed here
        spm.setBank(dto.getBank());
        spm.setAccountNumber(dto.getAccountNumber());
        spm.setQrImg(dto.getQrImg());

        spmRepo.save(spm);
    }

    public void update(Long id, SupplierPaymentMethodRequestDTO dto) {
        SupplierPaymentMethod spm = spmRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found"));

        Supplier supplier = supplierRepo.findById(dto.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));

        spm.setSupplier(supplier);
        spm.setPaymentType(dto.getPaymentType());   // <-- fixed here
        spm.setBank(dto.getBank());
        spm.setAccountNumber(dto.getAccountNumber());
        spm.setQrImg(dto.getQrImg());

        spmRepo.save(spm);
    }


    public List<SupplierPaymentMethodResponseDTO> getAllPaymentMethods() {
        List<SupplierPaymentMethod> spmList = spmRepo.findAll();
        List<SupplierPaymentMethodResponseDTO> dtoList = new ArrayList<>();

        for (SupplierPaymentMethod spm : spmList) {
            SupplierPaymentMethodResponseDTO dto = new SupplierPaymentMethodResponseDTO();
            dto.setId(spm.getId());
            dto.setSupplierName(spm.getSupplier().getSupplierName());
            dto.setSupplierId(spm.getSupplier().getId());
            dto.setPaymentType(spm.getPaymentType());
            dto.setBank(spm.getBank());
            dto.setAccountNumber(spm.getAccountNumber());

            // Convert byte[] QR image to base64 string
            if (spm.getQrImg() != null) {
                String base64 = Base64.getEncoder().encodeToString(spm.getQrImg());
                dto.setQrImgBase64("data:image/png;base64," + base64);
            } else {
                dto.setQrImgBase64(null);
            }

            dtoList.add(dto);
        }

        return dtoList;
    }

}
