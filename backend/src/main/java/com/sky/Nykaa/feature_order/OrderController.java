// src/main/java/com/sky/Nykaa/feature_order/OrderController.java
package com.sky.Nykaa.feature_order;

import com.sky.Nykaa.feature_order.dto.CreateOrderRequest;
import com.sky.Nykaa.feature_order.dto.OrderDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Handles POST requests to create a new order.
     * @param request The order details from the client.
     * @param userDetails The authenticated user, injected by Spring Security.
     * @return The created order as a clean DTO.
     */
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        OrderDto createdOrderDto = orderService.createOrderAndMapToDto(request, userDetails.getUsername());
        return new ResponseEntity<>(createdOrderDto, HttpStatus.CREATED);
    }

    /**
     * NEW ENDPOINT: Handles GET requests to fetch a user's saved shipping addresses.
     * @param userDetails The authenticated user, injected by Spring Security.
     * @return A ResponseEntity containing a list of address strings.
     */
    @GetMapping("/addresses")
    public ResponseEntity<List<String>> getSavedAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        List<String> addresses = orderService.getSavedAddressesForUser(userDetails.getUsername());
        return ResponseEntity.ok(addresses);
    }
}
