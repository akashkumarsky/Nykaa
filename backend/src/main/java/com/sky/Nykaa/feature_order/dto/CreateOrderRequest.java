// src/main/java/com/sky/Nykaa/feature_order/dto/CreateOrderRequest.java
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
    @Valid
    private List<OrderItemRequest> items;

    // UPDATED: Added a field to receive the shipping address.
    @NotEmpty
    private String shippingAddress;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @NotNull
        @Min(1)
        private int quantity;
    }
}
