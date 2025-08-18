package com.sky.Nykaa.feature_product;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "brands")
@Getter
@Setter
@EqualsAndHashCode(exclude = "products")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String image;

    @OneToMany(mappedBy = "brand")
    @JsonManagedReference("product-brand") // Named managed reference
    private Set<Product> products;
}
