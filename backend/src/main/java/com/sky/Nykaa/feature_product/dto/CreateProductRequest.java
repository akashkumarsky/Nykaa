package com.sky.Nykaa.feature_product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    @NotEmpty
    private String name;

    private String description;

    @NotNull
    @Positive
    private BigDecimal price;

    @org.hibernate.validator.constraints.URL
    private String imageUrl;

    @NotNull
    @Min(0)
    private int stockQuantity;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long brandId;
}