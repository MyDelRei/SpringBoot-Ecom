package org.project.ecom.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    @GetMapping("/admin/login")
    public String adminLoginPage() {
        return "login"; // maps to templates/login.html
    }

    @GetMapping("/admin/dashboard")
    public String dashboard() {
        return "admin/dashboard"; // templates/dashboard.html
    }
}