// src/main/java/com/sky/Nykaa/feature_cart/dto/UpdateQuantityRequest.java
package com.sky.Nykaa.feature_cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateQuantityRequest {
    @NotNull
    @Min(1) // Quantity must be at least 1
    private int quantity;
}