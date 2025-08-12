package com.sky.Nykaa.feature_cart.dto;

import com.sky.Nykaa.feature_user.dto.UserDto;
import lombok.Data;
import java.util.Set;

@Data
public class CartDto {
    private Long id;
    private UserDto user;
    private Set<CartItemDto> cartItems;
}