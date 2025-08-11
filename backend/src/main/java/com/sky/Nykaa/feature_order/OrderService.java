package com.sky.Nykaa.feature_order;

import com.sky.Nykaa.common.exception.ResourceNotFoundException;
import com.sky.Nykaa.feature_order.dto.CreateOrderRequest;
import com.sky.Nykaa.feature_product.Product;
import com.sky.Nykaa.feature_product.ProductRepository;
import com.sky.Nykaa.feature_user.User;
import com.sky.Nykaa.feature_user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * Creates a new order for the given user with the items from the request.
     * This operation is transactional. If any part fails (e.g., stock issue),
     * the entire transaction is rolled back.
     *
     * @param request The request containing the list of product IDs and quantities.
     * @param userEmail The email of the currently authenticated user placing the order.
     * @return The newly created Order entity.
     */
    @Transactional
    public Order createOrder(CreateOrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");

        Set<OrderItem> orderItems = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new IllegalStateException("Not enough stock for product: " + product.getName());
            }

            // Create a new OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice()); // Lock in the price at time of order
            orderItem.setOrder(order);
            orderItems.add(orderItem);

            // Update total amount
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            // Decrease product stock
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }
}