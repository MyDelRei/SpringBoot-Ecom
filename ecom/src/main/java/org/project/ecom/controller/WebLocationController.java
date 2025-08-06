package org.project.ecom.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebLocationController {
    @GetMapping("/location")
    public String Location(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "Request page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/location-list");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

    @GetMapping("/location/add")
    public String addLocation(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "Request page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/add-location");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

}
