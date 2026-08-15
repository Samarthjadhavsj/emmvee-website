package com.emmvee.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/profile")
    public String profile(Authentication authentication) {

        System.out.println("AUTHENTICATION = " + authentication);

        System.out.println(
                "SECURITY CONTEXT = " +
                SecurityContextHolder.getContext().getAuthentication()
        );

        return "Authenticated user: "
                + authentication.getName();
    }
}