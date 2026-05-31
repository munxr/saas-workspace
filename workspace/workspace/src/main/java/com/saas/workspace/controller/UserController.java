package com.saas.workspace.controller;

import com.saas.workspace.entity.User;
import com.saas.workspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // NEW IMPORT
import org.springframework.web.bind.annotation.*; // UPDATED TO INCLUDE ALL MAPPINGS

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // We need this to securely hash their password!

    @GetMapping
    public ResponseEntity<List<User>> getTeamMembers() {
        List<User> team = userRepository.findAll();
        return ResponseEntity.ok(team);
    }

    // NEW ENDPOINT TO INVITE A COWORKER
    @PostMapping("/invite")
    public ResponseEntity<?> inviteUser(@RequestBody Map<String, String> body, java.security.Principal principal) {

        // 1. Find out exactly who is making this request
        User requestingUser = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Requesting user not found"));

        // 2. THE BOUNCER: If they are not an ADMIN, reject the request with a 403 Forbidden!
        if (requestingUser.getRole() != com.saas.workspace.entity.Role.ADMIN) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body("Security Alert: Only Admins can invite new users.");
        }

        // 3. If they passed the check, create the new user
        User newUser = new User();
        newUser.setEmail(body.get("email"));
        newUser.setFullName(body.get("fullName"));
        newUser.setRole(com.saas.workspace.entity.Role.MEMBER);
        newUser.setPasswordHash(passwordEncoder.encode("Welcome123!"));

        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(java.security.Principal principal) {
        // Spring Security automatically extracts the email from the JWT token and puts it in 'principal'
        User currentUser = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        return ResponseEntity.ok(currentUser);
    }
}