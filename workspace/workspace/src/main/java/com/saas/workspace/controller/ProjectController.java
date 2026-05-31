package com.saas.workspace.controller;

import com.saas.workspace.entity.Project;
import com.saas.workspace.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService; // You already have this one!

    // ADD THESE TWO:
    @Autowired
    private com.saas.workspace.repository.UserRepository userRepository; // Needed to check if they are an Admin

    @Autowired
    private com.saas.workspace.repository.ProjectRepository projectRepository; // Needed to actually delete the project
    // THE NEW SECURE DELETE ENDPOINT
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable java.util.UUID id, java.security.Principal principal) {

        // 1. Check their ID badge
        com.saas.workspace.entity.User currentUser = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. The Bouncer: Reject if they are a MEMBER
        if (currentUser.getRole() != com.saas.workspace.entity.Role.ADMIN) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body("Security Alert: Only Admins can delete projects.");
        }

        // 3. If they are an Admin, destroy the project
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // POST endpoint to create a project
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project savedProject = projectService.createProject(project);
        return ResponseEntity.ok(savedProject);
    }

    // GET endpoint to fetch projects
    @GetMapping
    public ResponseEntity<List<Project>> getProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
}