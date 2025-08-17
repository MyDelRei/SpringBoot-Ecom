package org.project.ecom.service;

import org.project.ecom.model.Warehouse;
import org.project.ecom.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLDataException;
import java.util.List;

@Service
public class WarehouseService {

   @Autowired
   WarehouseRepository warehouseRepository;

   public List<Warehouse> getAllWarehouse(){
       return  warehouseRepository.findAll();
   }

   public Warehouse getWarehouseById(Warehouse model){
       return warehouseRepository.findById(model.getWarehouseId()).orElseThrow(() -> new RuntimeException("Warehouse not found"));

   }

   public Warehouse saveWarehouse(Warehouse model){
       try{
           return warehouseRepository.save(model);
       } catch (Exception e) {
           throw new RuntimeException(e);
       }

   }


   public Warehouse updateWarehouse(Warehouse model){
       try{
           Warehouse warehouseModel = warehouseRepository.findById(model.getWarehouseId()).orElseThrow(() -> new RuntimeException("Warehouse not found"));
            warehouseModel.setWarehouseName(model.getWarehouseName());
            warehouseModel.setLocation(model.getLocation());
            warehouseModel.setDescription(model.getDescription());
            return warehouseRepository.save(warehouseModel);
       } catch (Exception e) {
           throw new RuntimeException(e);
       }
   }

   public String DeleteWarehouse(Warehouse model){
       try{
           Warehouse delete = warehouseRepository.findById(model.getWarehouseId()).orElseThrow(() -> new RuntimeException("Warehouse not found"));
           warehouseRepository.delete(delete);
           return "Warehouse deleted";
       } catch (Exception e) {
           throw new RuntimeException(e);
       }
   }

   public Long totalWarehouse(){
       return warehouseRepository.count();
   }
}
