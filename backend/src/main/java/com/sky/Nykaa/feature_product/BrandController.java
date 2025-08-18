package com.sky.Nykaa.feature_product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Brand>> getAllBrands() {
        return ResponseEntity.ok(productService.getAllBrands());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        // Logic to create a brand will be added to ProductService
        return new ResponseEntity<>(productService.createBrand(brand), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody Brand brandDetails) {
        // Logic to update a brand will be added to ProductService
        return ResponseEntity.ok(productService.updateBrand(id, brandDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        // Logic to delete a brand will be added to ProductService
        productService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }
}
