package org.project.ecom.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebProductArrivalController {

    @GetMapping("/product-arrival")
    public String productArrivalPage(Model model, String success, HttpServletRequest request) {
        model.addAttribute("pageTitle", "Product Arrival");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/product-arrival");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }
    @GetMapping("/product-arrival/add")
    public String addProductArrivalPage(Model model, String success, HttpServletRequest request) {
        model.addAttribute("pageTitle", "Add Product Arrival");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/add-pro-arrival");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }
}
