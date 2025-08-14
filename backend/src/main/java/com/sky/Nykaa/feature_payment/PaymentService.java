// src/main/java/com/sky/Nykaa/feature_payment/PaymentService.java
package com.sky.Nykaa.feature_payment;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PaymentService {

    // These values are injected from your application.properties file
    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    /**
     * Creates a new order on the Razorpay servers.
     * @param amount The total amount of the order.
     * @return The created Razorpay Order object.
     * @throws RazorpayException if there's an error communicating with the API.
     */
    public Order createRazorpayOrder(BigDecimal amount) throws RazorpayException {
        // Initialize the Razorpay client with your API keys
        RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

        // Create a JSON object for the order request
        JSONObject orderRequest = new JSONObject();

        // Amount must be in the smallest currency unit (e.g., paise for INR).
        // We multiply the Rupee amount by 100 and convert it to an integer.
        orderRequest.put("amount", amount.multiply(new BigDecimal(100)).setScale(0, RoundingMode.HALF_UP).intValue());
        orderRequest.put("currency", "INR");

        // You can generate a unique receipt ID for your records
        orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());

        // Create the order on Razorpay's servers
        return razorpayClient.orders.create(orderRequest);
    }
}
