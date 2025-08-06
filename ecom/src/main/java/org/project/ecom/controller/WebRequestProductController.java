package org.project.ecom.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebRequestProductController {

    @GetMapping("/Request")
    public String showRequest(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "Request page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/requestProduct");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

    @GetMapping("/Request/purchase")
    public String showPurchase(Model model, @RequestParam(required = false) String success, HttpServletRequest request) { // Add HttpServletRequest
        model.addAttribute("pageTitle", "Request page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/purchaseProduct");
        model.addAttribute("currentUri", request.getRequestURI()); // Pass current URI
        return "layout";
    }

    @GetMapping("/payment/purchase")
    public String showPurchasePayment(
            Model model,
            @RequestParam(required = false) String success,
            @RequestParam(required = false) String requestId, // ✅ add this
            HttpServletRequest request
    ) {
        model.addAttribute("pageTitle", "payment page");
        model.addAttribute("successMessage", success);
        model.addAttribute("requestId", requestId); // ✅ pass to the view
        model.addAttribute("contentFragment", "admin/purchasePayment");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }

}
