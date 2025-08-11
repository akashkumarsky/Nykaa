package com.sky.Nykaa.feature_order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // **FIXED**: Changed findByUserId to findByUser_Id
    // This correctly tells Spring Data JPA to look for the 'id' property within the 'user' object.
    List<Order> findByUser_Id(Long userId);
}