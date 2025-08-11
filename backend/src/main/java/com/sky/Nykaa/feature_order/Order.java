package com.sky.Nykaa.feature_order;

import com.sky.Nykaa.feature_user.User;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String status; // e.g., "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"

    // This establishes the one-to-many relationship.
    // cascade = CascadeType.ALL: Operations (like save) on Order will cascade to its OrderItems.
    // orphanRemoval = true: If an OrderItem is removed from this set, it's deleted from the DB.
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> orderItems;

    @PrePersist
    protected void onCreate() {
        this.orderDate = LocalDateTime.now();
    }
}
