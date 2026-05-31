package com.saas.workspace.service;

import com.saas.workspace.entity.Project;
import com.saas.workspace.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    // Save a new project
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // Get all projects for the current tenant
    public List<Project> getAllProjects() {
        // Because of our Interceptor and Resolver, this will ONLY return
        // projects belonging to the Tenant ID in the current HTTP Header!
        return projectRepository.findAll();
    }
}