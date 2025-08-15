package org.project.ecom.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class WebStockingController {

    @GetMapping("/stock")
    public String stock(Model model, HttpServletRequest request, @RequestParam(required = false) String success) {
        model.addAttribute("pageTitle", "Stock");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/stock");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }

    @GetMapping("/stock/list-individual")
    public String showIndividual(Model model, HttpServletRequest request, @RequestParam(required = false) String success) {
        model.addAttribute("pageTitle", "List individual unit");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/individual-unit");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }

    @GetMapping("/stock/add-individual-stock")
    public String addIndividual(Model model, HttpServletRequest request, @RequestParam(required = false) String success) {
        model.addAttribute("pageTitle", "Add individual unit");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/add-individual");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }

    @GetMapping("/stock/list-inventory")
    public String showInventory(Model model, HttpServletRequest request, @RequestParam(required = false) String success) {
        model.addAttribute("pageTitle", "List individual unit");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/inventory");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }

    @GetMapping("/stock/add-inventory")
    public String addInventory(Model model, HttpServletRequest request, @RequestParam(required = false) String success) {
        model.addAttribute("pageTitle", "Add inventory unit");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/add-inventory");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }



    @GetMapping("/stock/view-stock")
    public String viewStock(Model model, HttpServletRequest request, @RequestParam(required = false) String success) {
        model.addAttribute("pageTitle", " unit");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/view-stocking");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }




}
