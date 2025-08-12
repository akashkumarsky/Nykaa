package com.sky.Nykaa.feature_product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


// **FIXED**: Added the public access modifier
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // NEW: JPQL query to select all unique category names, sorted alphabetically.
    @Query("SELECT DISTINCT c.name FROM Category c ORDER BY c.name ASC")
    List<String> findAllCategoryNames();

}



