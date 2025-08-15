package com.sky.Nykaa.feature_order.dto;

import com.sky.Nykaa.feature_user.dto.UserDto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class OrderDto {
    private Long id;
    private UserDto user; // Uses the existing UserDto to hide the password
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private Set<OrderItemDto> orderItems;
}