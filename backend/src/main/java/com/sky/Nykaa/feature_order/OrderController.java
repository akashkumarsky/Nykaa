package com.sky.Nykaa.feature_order;

import com.sky.Nykaa.feature_order.dto.CreateOrderRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Endpoint to create a new order.
     * Accessible only by authenticated users.
     *
     * @param request The order creation request from the client.
     * @param userDetails The details of the logged-in user, injected by Spring Security.
     * @return The created order details.
     */
    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        // userDetails.getUsername() will return the email in our setup
        Order createdOrder = orderService.createOrder(request, userDetails.getUsername());
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
}
