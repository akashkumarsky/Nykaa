package com.sky.Nykaa.feature_product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


// **FIXED**: Added the public access modifier
@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    // NEW: JPQL query to select all unique brand names, sorted alphabetically.
    @Query("SELECT DISTINCT b.name FROM Brand b ORDER BY b.name ASC")
    List<String> findAllBrandNames();
}

