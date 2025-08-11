package com.sky.Nykaa.feature_order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {

    @NotEmpty
    @Valid // This ensures that the objects inside the list are also validated
    private List<OrderItemRequest> items;

    // Inner class representing a single item in the order request
    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @NotNull
        @Min(1)
        private int quantity;
    }
}