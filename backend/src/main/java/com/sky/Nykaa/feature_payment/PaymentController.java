package com.sky.Nykaa.feature_payment;

import com.razorpay.Order;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // This endpoint creates a Razorpay order
    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        BigDecimal amount = new BigDecimal(data.get("amount").toString());
        Order order = paymentService.createRazorpayOrder(amount);
        return ResponseEntity.ok(order.toString());
    }
}