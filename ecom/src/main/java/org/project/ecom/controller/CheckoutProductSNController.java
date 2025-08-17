package org.project.ecom.controller;

import org.project.ecom.model.CheckoutProductSn;
import org.project.ecom.service.CheckoutProductSNService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/checkout/sn")
public class CheckoutProductSNController {


    @Autowired
    CheckoutProductSNService service;



    @PostMapping
    public CheckoutProductSn checkout(@RequestParam String serialNumber) {
        return service.checkoutProduct(serialNumber);
    }


}
