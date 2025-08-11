package com.sky.Nykaa.feature_product.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private int stockQuantity;
    private String categoryName;
    private String brandName;
}