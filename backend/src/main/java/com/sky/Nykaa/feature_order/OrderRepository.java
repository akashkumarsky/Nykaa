package com.sky.Nykaa.feature_order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Finds all orders placed by a specific user
    List<Order> findByUserId(Long userId);
}