package org.project.ecom.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.project.ecom.model.PurchaseRequest;
import org.project.ecom.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
public class WebRequestProductController {
    @Autowired
    PurchaseService purchaseService;

    @GetMapping("/Request")
    public String showRequest(Model model,
                              @RequestParam(required = false) String msg,
                              HttpServletRequest request) {
        model.addAttribute("pageTitle", "Request page");
        model.addAttribute("msg", msg);
        model.addAttribute("contentFragment", "admin/requestProduct");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }

    @GetMapping("/Request/purchase")
    public String showPurchase(Model model,
                               @RequestParam(required = false) String success,
                               HttpServletRequest request) {
        model.addAttribute("pageTitle", "Request page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/purchaseProduct");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }

    @GetMapping("/payment/purchase")
    public String showPurchasePayment(Model model,
                                      @RequestParam(required = false) String success,
                                      @RequestParam(required = false) String requestId,
                                      HttpServletRequest request) {

        if (requestId != null && !requestId.isBlank()) {
            try {
                PurchaseRequest pr = purchaseService.getPurchaseRequest(Long.valueOf(requestId));

                if (pr.getStatus().equalsIgnoreCase("PAID") || pr.getStatus().equalsIgnoreCase("APPROVED")) {
                    String msg = "The Request Payment Was Made";
                    return "redirect:/Request?msg=" + URLEncoder.encode(msg, StandardCharsets.UTF_8);
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid requestId: " + requestId);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        model.addAttribute("pageTitle", "Payment page");
        model.addAttribute("successMessage", success);
        model.addAttribute("requestId", requestId);
        model.addAttribute("contentFragment", "admin/purchasePayment");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }

    @GetMapping("/payment-list")
    public String paymentList(Model model,
                              @RequestParam(required = false) String success,
                              HttpServletRequest request) {
        model.addAttribute("pageTitle", "Payment page");
        model.addAttribute("successMessage", success);
        model.addAttribute("contentFragment", "admin/payment-list");
        model.addAttribute("currentUri", request.getRequestURI());
        return "layout";
    }
}
