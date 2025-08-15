// src/main/java/com/sky/Nykaa/feature_order/OrderService.java
package com.sky.Nykaa.feature_order;

import com.sky.Nykaa.common.exception.ResourceNotFoundException;
import com.sky.Nykaa.feature_cart.Cart;
import com.sky.Nykaa.feature_cart.CartRepository;
import com.sky.Nykaa.feature_order.dto.CreateOrderRequest;
import com.sky.Nykaa.feature_order.dto.OrderDto;
import com.sky.Nykaa.feature_order.dto.OrderItemDto;
import com.sky.Nykaa.feature_product.Product;
import com.sky.Nykaa.feature_product.ProductRepository;
import com.sky.Nykaa.feature_product.dto.ProductDto;
import com.sky.Nykaa.feature_user.User;
import com.sky.Nykaa.feature_user.UserRepository;
import com.sky.Nykaa.feature_user.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CartRepository cartRepository;

    public OrderDto createOrderAndMapToDto(CreateOrderRequest request, String userEmail) {
        Order order = createOrderInDatabase(request, userEmail);
        return mapEntityToDto(order);
    }

    @Transactional
    private Order createOrderInDatabase(CreateOrderRequest request, String userEmail) {
        // ... (this method is correct and does not need changes)
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalStateException("Order request must contain at least one item.");
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setShippingAddress(request.getShippingAddress());

        Set<OrderItem> orderItems = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Product> productsToUpdate = new ArrayList<>();

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            if (product.getPrice() == null) throw new IllegalStateException("Product price is null");
            if (product.getStockQuantity() < itemRequest.getQuantity()) throw new IllegalStateException("Not enough stock");

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
        Order savedOrder = orderRepository.save(order);

        Cart userCart = cartRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new IllegalStateException("Could not find cart for user to clear."));
        userCart.getCartItems().clear();
        cartRepository.save(userCart);

        return savedOrder;
    }

    public List<String> getSavedAddressesForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        return orderRepository.findDistinctShippingAddressesByUserId(user.getId());
    }

    public List<OrderDto> getOrdersForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        List<Order> orders = orderRepository.findByUser_Id(user.getId());

        return orders.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    private OrderDto mapEntityToDto(Order order) {
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setStatus(order.getStatus());
        orderDto.setTotalAmount(order.getTotalAmount());
        // **FIXED**: This line was missing. It adds the address to the response.
        orderDto.setShippingAddress(order.getShippingAddress());

        UserDto userDto = new UserDto();
        userDto.setId(order.getUser().getId());
        userDto.setFirstName(order.getUser().getFirstName());
        userDto.setLastName(order.getUser().getLastName());
        userDto.setEmail(order.getUser().getEmail());
        userDto.setRole(order.getUser().getRole());
        orderDto.setUser(userDto);

        Set<OrderItemDto> itemDtos = order.getOrderItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setId(item.getId());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPrice(item.getPrice());

            ProductDto productDto = new ProductDto();
            productDto.setId(item.getProduct().getId());
            productDto.setName(item.getProduct().getName());
            productDto.setDescription(item.getProduct().getDescription());
            productDto.setPrice(item.getProduct().getPrice());
            productDto.setImageUrl(item.getProduct().getImageUrl());
            productDto.setStockQuantity(item.getProduct().getStockQuantity());

            if (item.getProduct().getCategory() != null) {
                productDto.setCategoryName(item.getProduct().getCategory().getName());
            }
            if (item.getProduct().getBrand() != null) {
                productDto.setBrandName(item.getProduct().getBrand().getName());
            }

            itemDto.setProduct(productDto);
            return itemDto;
        }).collect(Collectors.toSet());

        orderDto.setOrderItems(itemDtos);

        return orderDto;
    }
}
