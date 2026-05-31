package com.saas.workspace.controller;

import com.saas.workspace.entity.Status;
import com.saas.workspace.repository.ProjectRepository;
import com.saas.workspace.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/metrics")
    public Map<String, Object> getMetrics() {
        // 1. Get the raw numbers
        long totalProjects = projectRepository.count();
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus(Status.DONE);

        // 2. Calculate the percentage safely (to avoid dividing by zero if there are no tasks yet)
        long completionPercentage = totalTasks == 0 ? 0 : (completedTasks * 100) / totalTasks;

        // 3. Package it all up in a map to send as JSON
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalProjects", totalProjects);
        metrics.put("totalTasks", totalTasks);
        metrics.put("completionPercentage", completionPercentage);

        return metrics;
    }
}