package com.saas.workspace.repository;

import com.saas.workspace.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    // ADD THIS EXACT LINE:
    // Spring Boot will automatically translate this into:
    // SELECT * FROM tasks WHERE project_id = ?
    List<Task> findByProjectId(UUID projectId);
    // Spring Boot will automatically write the SQL query for this!
    long countByStatus(com.saas.workspace.entity.Status status);

}