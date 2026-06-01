package com.saas.workspace.controller;

import com.saas.workspace.dto.LoginRequest;
import com.saas.workspace.dto.RegisterRequest;
import com.saas.workspace.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://saas-workspace-seven.vercel.app"})
public class AuthController {

    @Autowired
    private AuthService authService;

    // The Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String token = authService.registerAndCreateWorkspace(request);
        return ResponseEntity.ok(token);
    }

    // The Real Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}