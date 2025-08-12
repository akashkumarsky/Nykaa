package com.sky.Nykaa.feature_cart.dto;

import com.sky.Nykaa.feature_product.dto.ProductDto;
import lombok.Data;

@Data
public class CartItemDto {
    private Long id;
    private ProductDto product;
    private int quantity;
}