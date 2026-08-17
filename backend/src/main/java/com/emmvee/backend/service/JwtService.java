package com.emmvee.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET =
            "EmmveeCareersJwtSecretKeyForDevelopmentOnly123456789";

    private static final long EXPIRATION_TIME =
            1000L * 60 * 60; // 1 hour

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public String generateToken(
            Long userId,
            String email,
            String role) {

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )
                .signWith(secretKey)
                .compact();
    }
}