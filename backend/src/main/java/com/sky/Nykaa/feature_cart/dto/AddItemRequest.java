package com.sky.Nykaa.feature_cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddItemRequest {
    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private int quantity;
}
