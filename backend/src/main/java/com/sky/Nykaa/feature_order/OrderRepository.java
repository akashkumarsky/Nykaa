package com.sky.Nykaa.feature_order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser_Id(Long userId);

    // NEW QUERY: Selects only the distinct shippingAddress strings for a given user ID.
    @Query("SELECT DISTINCT o.shippingAddress FROM Order o WHERE o.user.id = :userId")
    List<String> findDistinctShippingAddressesByUserId(@Param("userId") Long userId);
}
