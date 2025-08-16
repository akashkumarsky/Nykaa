// src/main/java/com/sky/Nykaa/feature_cart/CartController.java
package com.sky.Nykaa.feature_cart;

import com.sky.Nykaa.feature_cart.dto.AddItemRequest;
import com.sky.Nykaa.feature_cart.dto.CartDto;
import com.sky.Nykaa.feature_cart.dto.UpdateQuantityRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * Handles GET requests to fetch the current user's shopping cart.
     * @param userDetails The authenticated user, injected by Spring Security.
     * @return A ResponseEntity containing the user's cart data as a CartDto.
     */
    @GetMapping
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        CartDto cartDto = cartService.getCartDtoForUser(userDetails.getUsername());
        return ResponseEntity.ok(cartDto);
    }

    /**
     * Handles POST requests to add a new item to the user's shopping cart.
     * @param request The request body containing the productId and quantity.
     * @param userDetails The authenticated user.
     * @return A ResponseEntity containing the updated cart data as a CartDto.
     */
    @PostMapping("/items")
    public ResponseEntity<CartDto> addItemToCart(@Valid @RequestBody AddItemRequest request,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        CartDto updatedCartDto = cartService.addItemToCartAndMapToDto(userDetails.getUsername(), request);
        return ResponseEntity.ok(updatedCartDto);
    }

    /**
     * Handles PUT requests to update the quantity of a specific item in the cart.
     * @param cartItemId The ID of the cart item to update.
     * @param request The request body containing the new quantity.
     * @param userDetails The authenticated user.
     * @return A ResponseEntity containing the updated cart data as a CartDto.
     */
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartDto> updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateQuantityRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        CartDto updatedCart = cartService.updateItemQuantityAndMapToDto(userDetails.getUsername(), cartItemId, request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * Handles DELETE requests to remove an item completely from the cart.
     * @param cartItemId The ID of the cart item to remove.
     * @param userDetails The authenticated user.
     * @return A ResponseEntity containing the updated cart data as a CartDto.
     */
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartDto> removeCartItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal UserDetails userDetails) {
        CartDto updatedCart = cartService.removeItemFromCartAndMapToDto(userDetails.getUsername(), cartItemId);
        return ResponseEntity.ok(updatedCart);
    }
}
