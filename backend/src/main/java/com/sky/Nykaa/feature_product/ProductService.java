// src/main/java/com/sky/Nykaa/feature_product/ProductService.java
package com.sky.Nykaa.feature_product;

import com.sky.Nykaa.common.exception.ResourceNotFoundException;
import com.sky.Nykaa.feature_product.dto.CreateProductRequest;
import com.sky.Nykaa.feature_product.dto.ProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private BrandRepository brandRepository;

    /**
     * Gets a paginated and optionally filtered list of products.
     * @param categories A list of category names to filter by (can be null).
     * @param brands A list of brand names to filter by (can be null).
     * @param pageable Pagination information.
     * @return A Page of products.
     */
    public Page<ProductDto> getAllProducts(List<String> categories, List<String> brands, Pageable pageable) {
        List<String> categoryFilter = (categories != null && !categories.isEmpty()) ? categories : null;
        List<String> brandFilter = (brands != null && !brands.isEmpty()) ? brands : null;

        Page<Product> productPage = productRepository.findByFilters(categoryFilter, brandFilter, pageable);
        return productPage.map(this::mapEntityToDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapEntityToDto(product);
    }

    public ProductDto createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setBrand(brand);

        Product savedProduct = productRepository.save(product);
        return mapEntityToDto(savedProduct);
    }

    /**
     * Gets a sorted list of all unique category names for the filter sidebar.
     */
    public List<String> getAllCategoryNames() {
        return categoryRepository.findAllCategoryNames();
    }

    /**
     * Gets a sorted list of all unique brand names for the filter sidebar.
     */
    public List<String> getAllBrandNames() {
        return brandRepository.findAllBrandNames();
    }

    private ProductDto mapEntityToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setCategoryName(product.getCategory().getName());
        dto.setBrandName(product.getBrand().getName());
        return dto;
    }
}
