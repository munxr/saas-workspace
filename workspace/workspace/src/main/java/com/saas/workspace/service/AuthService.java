package com.saas.workspace.service;

import com.saas.workspace.config.JwtUtil;
import com.saas.workspace.dto.LoginRequest;
import com.saas.workspace.dto.RegisterRequest;
import com.saas.workspace.entity.Role;
import com.saas.workspace.entity.Tenant;
import com.saas.workspace.entity.User;
import com.saas.workspace.repository.TenantRepository;
import com.saas.workspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired private TenantRepository tenantRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;


    public String registerAndCreateWorkspace(RegisterRequest request) {
        // 1. Check if email is already taken
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use!");
        }

        // 2. Create the new Company (Tenant)
        Tenant tenant = new Tenant();
        tenant.setName(request.getCompanyName());
        Tenant savedTenant = tenantRepository.save(tenant);

        // --- THE FIX IS HERE ---
        // Switch our current server thread into this brand new company's vault
        // so Hibernate allows us to save the User!
        String newTenantId = savedTenant.getId().toString();
        com.saas.workspace.config.TenantContext.setTenantId(newTenantId);

        // 3. Create the Admin User
        User user = new User();
        user.setTenantId(newTenantId); // Link user to company
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword())); // Scramble password
        user.setRole(Role.ADMIN);
        userRepository.save(user);

        // 4. Generate the JWT so they are instantly logged in
        return jwtUtil.generateToken(user.getEmail(), user.getTenantId());
    }

    public String login(LoginRequest request) {
        // 1. Find the user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check the password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        // 3. Generate the token
        return jwtUtil.generateToken(user.getEmail(), user.getTenantId());
    }
}