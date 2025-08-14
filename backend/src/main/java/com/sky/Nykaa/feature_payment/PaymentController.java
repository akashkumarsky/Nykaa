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

    /**
     * FIXED: This endpoint now returns a proper JSON object (as a Map)
     * instead of a plain string. This makes the API response consistent.
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        BigDecimal amount = new BigDecimal(data.get("amount").toString());
        Order order = paymentService.createRazorpayOrder(amount);
        // The order.toMap() method provides a clean JSON representation.
        return ResponseEntity.ok(order.toJson().toMap());
    }
}
