// src/main/java/com/sky/Nykaa/feature_product/ProductController.java
package com.sky.Nykaa.feature_product;

import com.sky.Nykaa.feature_product.dto.CreateProductRequest;
import com.sky.Nykaa.feature_product.dto.ProductDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Handles GET requests to fetch products with optional filtering and pagination.
     * Example URL: /api/products?page=0&size=12&categories=Makeup&brands=Maybelline&minPrice=500&maxPrice=2000
     */
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> brands,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> products = productService.getAllProducts(categories, brands, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * Handles GET requests for a single product by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * Handles POST requests to create a new product. (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductDto createdProduct = productService.createProduct(request);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    /**
     * Handles GET requests to fetch all unique category names for the filter sidebar.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(productService.getAllCategoryNames());
    }

    /**
     * Handles GET requests to fetch all unique brand names for the filter sidebar.
     */
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        return ResponseEntity.ok(productService.getAllBrandNames());
    }
}
