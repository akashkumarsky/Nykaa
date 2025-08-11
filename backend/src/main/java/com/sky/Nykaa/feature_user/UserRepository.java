package com.sky.Nykaa.feature_user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Finds a user by their email address.
    // Spring Data JPA automatically creates the query from the method name.
    Optional<User> findByEmail(String email);
}
