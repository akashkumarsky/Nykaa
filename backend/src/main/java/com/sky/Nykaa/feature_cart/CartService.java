// src/main/java/com/sky/Nykaa/feature_cart/CartService.java
package com.sky.Nykaa.feature_cart;

import com.sky.Nykaa.common.exception.ResourceNotFoundException;
import com.sky.Nykaa.feature_cart.dto.AddItemRequest;
import com.sky.Nykaa.feature_cart.dto.CartDto;
import com.sky.Nykaa.feature_cart.dto.CartItemDto;
import com.sky.Nykaa.feature_product.Product;
import com.sky.Nykaa.feature_product.ProductRepository;
import com.sky.Nykaa.feature_product.dto.ProductDto;
import com.sky.Nykaa.feature_user.User;
import com.sky.Nykaa.feature_user.UserRepository;
import com.sky.Nykaa.feature_user.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    public CartDto getCartDtoForUser(String userEmail) {
        Cart cart = getOrCreateCartForUser(userEmail);
        return mapCartToDto(cart);
    }

    public CartDto addItemToCartAndMapToDto(String userEmail, AddItemRequest request) {
        Cart updatedCart = addItemToCart(userEmail, request);
        return mapCartToDto(updatedCart);
    }

    // NEW: Public method for updating quantity
    public CartDto updateItemQuantityAndMapToDto(String userEmail, Long cartItemId, int newQuantity) {
        Cart updatedCart = updateItemQuantity(userEmail, cartItemId, newQuantity);
        return mapCartToDto(updatedCart);
    }

    // NEW: Public method for removing an item
    public CartDto removeItemFromCartAndMapToDto(String userEmail, Long cartItemId) {
        Cart updatedCart = removeItemFromCart(userEmail, cartItemId);
        return mapCartToDto(updatedCart);
    }

    @Transactional
    private Cart getOrCreateCartForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUser_Id(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    private Cart addItemToCart(String userEmail, AddItemRequest request) {
        Cart cart = getOrCreateCartForUser(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.getCartItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    /**
     * NEW: Updates the quantity of a specific item in the user's cart.
     */
    @Transactional
    private Cart updateItemQuantity(String userEmail, Long cartItemId, int newQuantity) {
        Cart cart = getOrCreateCartForUser(userEmail);
        CartItem item = cart.getCartItems().stream()
                .filter(ci -> ci.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found in user's cart"));

        item.setQuantity(newQuantity);
        return cartRepository.save(cart);
    }

    /**
     * NEW: Removes an item completely from the user's cart.
     */
    @Transactional
    private Cart removeItemFromCart(String userEmail, Long cartItemId) {
        Cart cart = getOrCreateCartForUser(userEmail);
        // The removeIf operation combined with orphanRemoval=true on the Cart entity
        // will correctly delete the item from the database.
        boolean removed = cart.getCartItems().removeIf(item -> item.getId().equals(cartItemId));
        if (!removed) {
            throw new ResourceNotFoundException("Cart item not found in user's cart");
        }
        return cartRepository.save(cart);
    }

    private CartDto mapCartToDto(Cart cart) {
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());

        UserDto userDto = new UserDto();
        userDto.setId(cart.getUser().getId());
        userDto.setEmail(cart.getUser().getEmail());
        userDto.setFirstName(cart.getUser().getFirstName());
        userDto.setLastName(cart.getUser().getLastName());
        cartDto.setUser(userDto);

        Set<CartItemDto> itemDtos = cart.getCartItems().stream().map(item -> {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setId(item.getId());
            itemDto.setQuantity(item.getQuantity());

            ProductDto productDto = new ProductDto();
            productDto.setId(item.getProduct().getId());
            productDto.setName(item.getProduct().getName());
            productDto.setPrice(item.getProduct().getPrice());
            productDto.setImageUrl(item.getProduct().getImageUrl());
            productDto.setBrandName(item.getProduct().getBrand().getName());
            productDto.setCategoryName(item.getProduct().getCategory().getName());

            itemDto.setProduct(productDto);
            return itemDto;
        }).collect(Collectors.toSet());

        cartDto.setCartItems(itemDtos);
        return cartDto;
    }
}
