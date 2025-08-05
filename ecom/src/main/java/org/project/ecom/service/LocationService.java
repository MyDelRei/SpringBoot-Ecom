package org.project.ecom.service;

import org.project.ecom.model.Location;
import org.project.ecom.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
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

    public Location updateLocation(Location model) {
        try {
            Location existing = locationRepository.findById(model.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found"));

            existing.setWarehouse(model.getWarehouse());
            existing.setSection(model.getSection());
            existing.setAisle(model.getAisle());
            existing.setBin(model.getBin());
            existing.setNote(model.getNote());

            return locationRepository.save(existing);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update location", e);
        }
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
