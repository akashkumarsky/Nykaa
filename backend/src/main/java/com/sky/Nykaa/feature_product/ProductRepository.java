
package com.sky.Nykaa.feature_product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * NEW METHOD: Finds products, optionally filtering by category and brand names.
     * This uses a JPQL query to handle cases where filters might be null or empty.
     */
    /**
     * UPDATED: Added minPrice and maxPrice to the query.
     */
    @Query("SELECT p FROM Product p WHERE " +
            "(:categories IS NULL OR p.category.name IN :categories) AND " +
            "(:brands IS NULL OR p.brand.name IN :brands) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> findByFilters(
            @Param("categories") List<String> categories,
            @Param("brands") List<String> brands,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
}
