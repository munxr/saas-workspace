package com.saas.workspace.service;

import com.saas.workspace.dto.TaskRequest;
import com.saas.workspace.entity.Project;
import com.saas.workspace.entity.Task;
import com.saas.workspace.entity.User;
import com.saas.workspace.repository.ProjectRepository;
import com.saas.workspace.repository.TaskRepository;
import com.saas.workspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private UserRepository userRepository;

    public Task createTask(TaskRequest request) {
        // 1. Find the parent Project
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // 2. Build the Task
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setProject(project);

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        // 3. Assign the User (if an ID was provided)
        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(user);
        }

        // Hibernate automatically locks this to the correct TenantId!
        return taskRepository.save(task);
    }


    public List<Task> getTasksByProject(UUID projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    public Task updateTaskStatus(String taskId, String newStatus) {
        // 1. Find the task (Translate the String ID into a UUID)
        Task task = taskRepository.findById(java.util.UUID.fromString(taskId))
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // 2. Update the status (Translate the String into your Status Enum)
        task.setStatus(com.saas.workspace.entity.Status.valueOf(newStatus));
        // Note: If your enum is in a different folder, just import it and use TaskStatus.valueOf(newStatus)

        // 3. Save and return it
        return taskRepository.save(task);
    }
    public void deleteTask(String taskId) {
        // Convert the String ID back to a UUID and tell the database to delete it
        taskRepository.deleteById(java.util.UUID.fromString(taskId));
    }
}