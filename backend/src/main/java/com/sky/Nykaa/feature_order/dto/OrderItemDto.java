package com.sky.Nykaa.feature_order.dto;

import com.sky.Nykaa.feature_product.dto.ProductDto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private Long id;
    private ProductDto product; // Uses the existing ProductDto for a clean product representation
    private int quantity;
    private BigDecimal price;
}