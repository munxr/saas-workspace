package com.saas.workspace.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Look for the "Authorization" header
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 2. Extract the token (Remove "Bearer " from the string)
            String token = authHeader.substring(7);

            if (jwtUtil.isTokenValid(token)) {
                // 3. Extract the hidden data
                String email = jwtUtil.extractEmail(token);
                String tenantId = jwtUtil.extractTenantId(token);

                // 4. Lock the tenantId into our ThreadLocal vault for Hibernate!
                TenantContext.setTenantId(tenantId);

                // 5. Tell Spring Security this user is officially logged in
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        try {
            // Let the request continue to the Controller
            filterChain.doFilter(request, response);
        } finally {
            // CRITICAL: Always clear the vault after the request finishes
            TenantContext.clear();
        }
    }
}