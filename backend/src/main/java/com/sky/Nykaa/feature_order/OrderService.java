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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(CreateOrderRequest request, String userEmail) {
        // **FIXED**: Added defensive null checks for the request object and its item list.
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalStateException("Order request must contain at least one item.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");

        Set<OrderItem> orderItems = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Product> productsToUpdate = new ArrayList<>();

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            if (itemRequest == null || itemRequest.getProductId() == null) {
                throw new IllegalStateException("Order item or product ID cannot be null.");
            }

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));

            if (product.getPrice() == null) {
                throw new IllegalStateException("Product " + product.getName() + " (ID: " + product.getId() + ") does not have a valid price.");
            }

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new IllegalStateException("Not enough stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);
            orderItems.add(orderItem);

            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productsToUpdate.add(product);
        }

        productRepository.saveAll(productsToUpdate);

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }
}