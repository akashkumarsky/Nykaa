package com.sky.Nykaa.feature_product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



// **FIXED**: Added the public access modifier
@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {}

