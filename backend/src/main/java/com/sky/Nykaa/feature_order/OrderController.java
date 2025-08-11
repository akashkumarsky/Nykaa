package com.sky.Nykaa.feature_order;

import com.sky.Nykaa.feature_order.dto.CreateOrderRequest;
import com.sky.Nykaa.feature_order.dto.OrderDto; // Import the new DTO
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

    // **FIXED**: The method now returns a ResponseEntity<OrderDto> to send the clean DTO.
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        // The service is called to create the order and map it to a safe DTO.
        OrderDto createdOrderDto = orderService.createOrderAndMapToDto(request, userDetails.getUsername());
        return new ResponseEntity<>(createdOrderDto, HttpStatus.CREATED);
    }
}