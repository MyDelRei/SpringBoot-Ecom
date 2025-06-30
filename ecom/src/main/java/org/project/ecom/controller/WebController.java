package org.project.ecom.controller;



import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebController {

    @GetMapping("/")
    public String showDashboard(Model model, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "My Dynamic Dashboard");
        model.addAttribute("contentFragment", "admin/dashboard");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

    @GetMapping("/brands")
    public String showBrand(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "Brand page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/brand-list");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

    @GetMapping("/brands/add-brand")
    public String showAddBrand(Model model, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "Add Brand");
        model.addAttribute("contentFragment", "admin/add-brand");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }
}
