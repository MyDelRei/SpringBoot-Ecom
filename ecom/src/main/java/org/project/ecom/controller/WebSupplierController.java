package org.project.ecom.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class WebSupplierController {

   @GetMapping("/supplier/add-supplier")
   public String addSupplier(Model model, HttpServletRequest request) { // Add HttpServletRequest
      model.addAttribute("pageTitle", "Add supplier");
      model.addAttribute("contentFragment", "admin/add-supplier");
      model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
      return "layout";
   }

}
