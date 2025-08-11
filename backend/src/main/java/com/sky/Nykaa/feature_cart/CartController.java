package com.sky.Nykaa.feature_cart;

import com.sky.Nykaa.feature_cart.dto.AddItemRequest;
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

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Cart cart = cartService.getCartForUser(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItemToCart(@Valid @RequestBody AddItemRequest request,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        Cart updatedCart = cartService.addItemToCart(userDetails.getUsername(), request);
        return ResponseEntity.ok(updatedCart);
    }
}