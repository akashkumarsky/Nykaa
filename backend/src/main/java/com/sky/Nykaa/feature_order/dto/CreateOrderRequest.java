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

    @NotEmpty
    private String shippingAddress;

    // UPDATED: Added fields to receive payment details from the frontend
    private String razorpayPaymentId;
    private String razorpayOrderId;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @NotNull
        @Min(1)
        private int quantity;
    }
}