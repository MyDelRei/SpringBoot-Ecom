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

    @GetMapping("/category")
    public String showCategory(Model model, @RequestParam(required = false) String success, HttpServletRequest request){
        model.addAttribute("pageTitle", "Category page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/category-list");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }
    @GetMapping("/category/add-category")
    public String showAddCategory(Model model, HttpServletRequest request){
        model.addAttribute("pageTitle", "Add Category");
        model.addAttribute("contentFragment", "admin/add-category");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }


    @GetMapping("/product")
    public String showProduct(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "product page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/product-list");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

    @GetMapping("/product/add-product")
    public String showAddProduct(Model model, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "Add Brand");
        model.addAttribute("contentFragment", "admin/add-product");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }








    @GetMapping("/sku")
    public String showSku(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "sku page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/sku-list");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

}
