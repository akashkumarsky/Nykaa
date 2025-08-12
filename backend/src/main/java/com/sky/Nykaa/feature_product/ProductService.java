package com.sky.Nykaa.feature_product;

import com.sky.Nykaa.common.exception.ResourceNotFoundException;
import com.sky.Nykaa.feature_product.dto.CreateProductRequest;
import com.sky.Nykaa.feature_product.dto.ProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // Import this
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private BrandRepository brandRepository;

    /**
     * UPDATED: This method now accepts a Pageable object to fetch a specific page of products.
     * @param pageable Contains pagination information (page number, size, sorting).
     * @return A Page object containing the products for the requested page and pagination metadata.
     */
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(pageable);
        // The .map() function on the Page object is a convenient way to convert a Page<Entity> to a Page<DTO>
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