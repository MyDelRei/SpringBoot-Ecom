package org.project.ecom.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.project.ecom.model.Supplier;
import org.project.ecom.repository.SupplierRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class WebSupplierController {

   private final SupplierRepository supplierRepository;

   public WebSupplierController(SupplierRepository supplierRepository) {
      this.supplierRepository = supplierRepository;
   }

   @GetMapping("/supplier/add-supplier")
   public String addSupplier(Model model, HttpServletRequest request) { // Add HttpServletRequest
      model.addAttribute("pageTitle", "Add supplier");
      model.addAttribute("contentFragment", "admin/add-supplier");
      model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
      return "layout";
   }

   @GetMapping("/supplier/list-supplier")
   public String ListSupplier(Model model, @RequestParam(required = false) String success,HttpServletRequest request) { // Add HttpServletRequest
      model.addAttribute("pageTitle", "Cyber supplier list");
      model.addAttribute("contentFragment", "admin/list-supplier");
      model.addAttribute("successMessage", success);
      model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
      return "layout";
   }

   @GetMapping("/supplier")
   public String Supplier(Model model, HttpServletRequest request) {
      model.addAttribute("pageTitle", "supplier");
      model.addAttribute("contentFragment", "admin/supplier");
      model.addAttribute("currentUri", request.getRequestURI());
      return "layout";
   }

   @GetMapping("/supplier/add-product")
   public String addSupplierProduct(Model model, HttpServletRequest request) {
      model.addAttribute("pageTitle", "Cyber");
      model.addAttribute("contentFragment", "admin/add-supplier-product");
      model.addAttribute("currentUri", request.getRequestURI());
      return "layout";
   }

   @GetMapping("/supplier/payment-method")
   public String supplierPaymentMethod(Model model, HttpServletRequest request) {
      model.addAttribute("pageTitle", "Cyber");
      model.addAttribute("contentFragment", "admin/supplier-payment-method-list");
      model.addAttribute("currentUri", request.getRequestURI());
      return "layout";
   }

   @GetMapping("/supplier/add-payment-method")
   public String addPaymentMethod(Model model, HttpServletRequest request) {
      model.addAttribute("pageTitle", "Cyber");
      model.addAttribute("contentFragment", "admin/add-supplier-payment-method");
      model.addAttribute("currentUri", request.getRequestURI());
      return "layout";
   }


   @GetMapping("/supplier/update-product")
   public String UpdateSupplierProduct(@RequestParam("supplierId") Long supplierId,Model model, HttpServletRequest request) {
      Supplier supplier = supplierRepository.findById(supplierId)
              .orElseThrow(() -> new RuntimeException("Supplier not found"));

      model.addAttribute("supplier", supplier);
      model.addAttribute("pageTitle", "Cyber");
      model.addAttribute("contentFragment", "admin/update-supplier-product");
      model.addAttribute("currentUri", request.getRequestURI());
      return "layout";
   }

}
