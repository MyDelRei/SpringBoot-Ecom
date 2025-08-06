package org.project.ecom.controller;


import jakarta.servlet.http.HttpServletRequest;

import org.project.ecom.model.Product;
import org.project.ecom.model.dto.ProductListDTO;
import org.project.ecom.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller()

public class WebSkuAttributeController {
    private final ProductService productService;

    public WebSkuAttributeController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/sku-att/sku-list")
   public String skuAttributes(Model model, @RequestParam(required = false) String success, HttpServletRequest request) {
      model.addAttribute("pageTitle", "sku page");
      model.addAttribute("successMessage", success);
      model.addAttribute("contentFragment", "admin/sku-attributes");
      model.addAttribute("currentUri", request.getRequestURI());
      return "layout";
   }
   
   @GetMapping("/sku-att/add-sku-att")
    public String addSkuAttributes(Model model, HttpServletRequest request, @RequestParam(required = false) String success) {
    model.addAttribute("pageTitle", "Add sku");
    model.addAttribute("successMessage", success);
    model.addAttribute("contentFragment", "admin/add-sku-att");
    model.addAttribute("currentUri", request.getRequestURI());
    return "layout";
}
    @GetMapping("/sku-att/update")
    public String updateSkuAttributes(Model model, HttpServletRequest request, @RequestParam(required = false) String success) {
      model.addAttribute("pageTitle", "Update sku");
      model.addAttribute("successMessage", success);
      model.addAttribute("contentFragment", "admin/update-sku-att");
      model.addAttribute("currentUri", request.getRequestURI());
      return "layout";
    }
}



