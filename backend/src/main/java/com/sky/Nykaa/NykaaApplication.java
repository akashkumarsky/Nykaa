package com.sky.Nykaa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.sky.Nykaa")
public class NykaaApplication {

	public static void main(String[] args) {
		SpringApplication.run(NykaaApplication.class, args);
	}

}
