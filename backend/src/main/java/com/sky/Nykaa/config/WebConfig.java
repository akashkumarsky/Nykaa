package com.sky.Nykaa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures global CORS settings for the entire application.
     * This allows the React frontend (running on a different port) to communicate
     * with the Spring Boot backend.
     */
   
}
