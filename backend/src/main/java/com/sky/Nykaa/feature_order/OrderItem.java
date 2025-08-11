package com.sky.Nykaa.feature_order;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.sky.Nykaa.feature_product.Product;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@EqualsAndHashCode(exclude = "order")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference // This is the "back" reference, it will NOT be serialized.
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER) // Eager fetch for simple serialization
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private BigDecimal price;
}
