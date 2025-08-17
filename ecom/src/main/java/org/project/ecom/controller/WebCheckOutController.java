package org.project.ecom.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebCheckOutController {

    @GetMapping("/checkout")
    public String checkout(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "checkout page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/checkout");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

    @GetMapping("/checkout/sn")
    public String checkoutsn(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "checkout page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/check-out-sn");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }
    @GetMapping("/checkout/ns")
    public String checkoutns(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "checkout page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/check-out-ns");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }


    @GetMapping("/report")
    public String report(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "checkout page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/report");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }
}
