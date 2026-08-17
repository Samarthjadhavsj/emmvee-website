package com.emmvee.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private static final String SECRET =
            "EmmveeCareersJwtSecretKeyForDevelopmentOnly123456789";

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        logger.info(
                "JWT filter called for: {}",
                request.getRequestURI()
        );

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            logger.info("No Bearer token found");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);

        try {

            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.getSubject();
            String role = claims.get("role", String.class);

            logger.info(
                    "JWT valid. User={}, role={}",
                    email,
                    role
            );

            List<SimpleGrantedAuthority> authorities =
                    List.of(
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role
                            )
                    );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            authorities
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            logger.info(
                    "Authentication set for user={}",
                    email
            );

        } catch (Exception exception) {

            logger.error(
                    "JWT validation failed: {}",
                    exception.getMessage(),
                    exception
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}