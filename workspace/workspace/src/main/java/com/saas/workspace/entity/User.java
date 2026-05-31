package com.saas.workspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.TenantId;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId // This is the magic multi-tenant annotation!
    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Role role = Role.MEMBER;
}