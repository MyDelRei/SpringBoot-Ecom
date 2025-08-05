package org.project.ecom.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class WebList_SupplierController {

   @GetMapping("/supplier/List_Supplier")
   public String addSupplier(Model model, HttpServletRequest request) { // Add HttpServletRequest
      model.addAttribute("pageTitle", "Add List_Supplier");
      model.addAttribute("contentFragment", "admin/List-Supplier");
      model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
      return "layout";
   }


}
