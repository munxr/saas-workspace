package com.saas.workspace.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // In a real app, this key should be hidden in application.properties!
    // We are generating a secure key on startup for this project.
//    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final String SECRET = "MySuperSecretKeyForMultiTenantSaaSWorkspace12345!";
    private final Key SECRET_KEY = io.jsonwebtoken.security.Keys.hmacShaKeyFor(SECRET.getBytes());

    // Token is valid for 10 hours
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10;

    // 1. Generate a token containing the user's email AND their specific tenantId
    public String generateToken(String email, String tenantId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("tenantId", tenantId) // Hiding the company ID inside the token!
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    // 2. Read the token and pull out the email
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // 3. Read the token and pull out the secret tenantId
    public String extractTenantId(String token) {
        return getClaims(token).get("tenantId", String.class);
    }

    // 4. Verify the token hasn't been tampered with
    public boolean isTokenValid(String token) {
        try {
            return getClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}