// src/main/java/com/sky/Nykaa/feature_order/OrderController.java
package com.sky.Nykaa.feature_order;

import com.sky.Nykaa.feature_order.dto.CreateOrderRequest;
import com.sky.Nykaa.feature_order.dto.OrderDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
     */
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        OrderDto createdOrderDto = orderService.createOrderAndMapToDto(request, userDetails.getUsername());
        return new ResponseEntity<>(createdOrderDto, HttpStatus.CREATED);
    }

    /**
     * FIXED: This is the missing endpoint. It handles GET requests to fetch the
     * authenticated user's complete order history.
     */
    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrderHistory(@AuthenticationPrincipal UserDetails userDetails) {
        List<OrderDto> orders = orderService.getOrdersForUser(userDetails.getUsername());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long orderId, @RequestBody java.util.Map<String, String> statusPayload) {
        String status = statusPayload.get("status");
        OrderDto updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * Handles GET requests to fetch a user's saved shipping addresses.
     */
    @GetMapping("/addresses")
    public ResponseEntity<List<String>> getSavedAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        List<String> addresses = orderService.getSavedAddressesForUser(userDetails.getUsername());
        return ResponseEntity.ok(addresses);
    }
}
