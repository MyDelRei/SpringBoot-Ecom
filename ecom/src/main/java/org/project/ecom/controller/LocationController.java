package org.project.ecom.controller;
import org.project.ecom.model.Location;
import org.project.ecom.model.Warehouse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.project.ecom.model.Location;
import org.project.ecom.service.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/locations")
public class LocationController {
   private final LocationService locationService;

   public LocationController(LocationService locationService) {
      this.locationService = locationService;
   }
   @GetMapping("/add")
   public String showAddLocationForm(Model model) {
      model.addAttribute("location", new Location());
      return "admin/add-location"; // path to your add-location.html
   }
   @GetMapping
   public ResponseEntity<List<Location>> getAllLocations() {
      return ResponseEntity.ok(locationService.getAllLocations());
   }
   @GetMapping("/{id}")
   public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
      Location model = new Location();
      model.setLocationId(id);
      return ResponseEntity.ok(locationService.getLocationById(model));
   }

   @PostMapping
   public ResponseEntity<Location> createLocation(@Valid @RequestBody Location location) {
      return new ResponseEntity<>(locationService.saveLocation(location), HttpStatus.CREATED);
   }

   @PutMapping
   public ResponseEntity<Location> updateLocation(@Valid @RequestBody Location location) {
      return ResponseEntity.ok(locationService.updateLocation(location));
   }

   @PostMapping("/delete-location")
   public ResponseEntity<String> deleteLocation(@RequestBody Location location) {
      return ResponseEntity.status(HttpStatus.NO_CONTENT).body(locationService.deleteLocation(location));
   }
   @ExceptionHandler(RuntimeException.class)
   public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
      if (ex.getMessage().contains("Location not found")) {
         return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
      }
      return new ResponseEntity<>("Unexpected error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
   }
}
