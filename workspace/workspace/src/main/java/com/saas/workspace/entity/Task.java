package com.saas.workspace.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.TenantId;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")

    private User assignedTo;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private Status status = Status.TODO;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}