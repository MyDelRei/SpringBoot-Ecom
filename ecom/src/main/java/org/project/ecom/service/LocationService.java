package org.project.ecom.service;

import org.project.ecom.model.Location;
import org.project.ecom.model.Warehouse;
import org.project.ecom.model.dto.GetLocation;
import org.project.ecom.model.dto.UpdateLocationDTO;
import org.project.ecom.repository.LocationRepository;
import org.project.ecom.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    public List<GetLocation> getAllLocations() {



        return locationRepository.findAll()
                .stream()
                .map(location -> {
                    GetLocation dto = new GetLocation();
                    dto.setLocationId(location.getLocationId());
                    dto.setWarehouse(location.getWarehouse().getWarehouseName());
                    dto.setSection(location.getSection());
                    dto.setAisle(location.getAisle());
                    dto.setBin(location.getBin());
                    dto.setNote(location.getNote());
                    return dto;
                })
                .collect(Collectors.toList());
    }


    public Location getLocationById(Location model) {
        return locationRepository.findById(model.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));
    }
    public Location saveLocation(Location model) {
        try {
            return locationRepository.save(model);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save location", e);
        }
    }

    public Location updateLocation(UpdateLocationDTO dto) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        location.setSection(dto.getSection());
        location.setAisle(dto.getAisle());
        location.setBin(dto.getBin());
        location.setNote(dto.getNote());

        return locationRepository.save(location);
    }

    public String deleteLocation(Location model) {
        try {
            Location existing = locationRepository.findById(model.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found"));

            locationRepository.delete(existing);
            return "Location deleted";
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete location", e);
        }
    }
}
