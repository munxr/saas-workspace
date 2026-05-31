package com.saas.workspace.controller;

import com.saas.workspace.dto.TaskRequest;
import com.saas.workspace.entity.Task;
import com.saas.workspace.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Create a new Task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    // Get all Tasks for a specific Project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable String taskId,
            @RequestBody java.util.Map<String, String> body) {

        // Extract the new status from the JSON body
        String newStatus = body.get("status");

        Task updatedTask = taskService.updateTaskStatus(taskId, newStatus);
        return ResponseEntity.ok(updatedTask);
    }
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable String taskId) {
        taskService.deleteTask(taskId);
        // Return a 204 No Content status, which means "Success, but I have no data to send back"
        return ResponseEntity.noContent().build();
    }
}