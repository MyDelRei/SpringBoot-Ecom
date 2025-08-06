package org.project.ecom.controller;


import org.project.ecom.model.Location;
import org.project.ecom.model.dto.GetLocation;
import org.project.ecom.model.dto.UpdateLocationDTO;
import org.project.ecom.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    // 🔹 Get all locations
    @GetMapping("/all")
    public ResponseEntity<List<GetLocation>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    // 🔹 Add a new location
    @PostMapping
    public ResponseEntity<?> addLocation(@RequestBody Location location) {
        try {
            Location saved = locationService.saveLocation(location);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save location: " + e.getMessage());
        }
    }

    // 🔹 Delete location by ID (from JS POST body)
    @PostMapping("/delete-location")
    public ResponseEntity<?> deleteLocation(@RequestBody Location model) {
        try {
            String result = locationService.deleteLocation(model);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete location: " + e.getMessage());
        }
    }

    // 🔹 Update location
    @PutMapping
    public ResponseEntity<?> updateLocation(@RequestBody UpdateLocationDTO location) {
        try {
            locationService.updateLocation(location);
            return ResponseEntity.ok("Updated location successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update location: " + e.getMessage());
        }
    }
}
