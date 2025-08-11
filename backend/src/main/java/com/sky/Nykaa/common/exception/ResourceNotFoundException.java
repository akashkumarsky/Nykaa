package com.sky.Nykaa.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Custom exception for when a requested resource (like a product or user) isn't found.
// The @ResponseStatus annotation tells Spring to return a 404 NOT FOUND status.
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}