package org.project.ecom.controller;



import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebController {

    @GetMapping("/")
    public String showDashboard(Model model) {
        model.addAttribute("pageTitle", "My Dynamic Dashboard");
        model.addAttribute("contentFragment", "dashboard");
        return "layout";
    }

    @GetMapping("/brands")
    public String showBrand(Model model,@RequestParam(required = false) String success) {
        model.addAttribute("pageTitle", "Brand page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/brand-list");
        return "layout";
    }

    @GetMapping("/brands/add-brand")
    public String showAddBrand(Model model) {
        model.addAttribute("pageTitle", "Add Brand");
        model.addAttribute("contentFragment", "admin/add-brand");
        return "layout";
    }
}
