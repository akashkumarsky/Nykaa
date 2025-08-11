package com.sky.Nykaa.feature_product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface BrandRepository extends JpaRepository<Brand, Long> {}