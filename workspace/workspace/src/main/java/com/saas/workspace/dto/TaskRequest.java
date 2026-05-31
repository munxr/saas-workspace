package com.saas.workspace.dto;

import com.saas.workspace.entity.Status;
import lombok.Data;
import java.util.UUID;

@Data
public class TaskRequest {
    private String title;
    private UUID projectId;
    private UUID assignedToId; // Optional: Link to the specific user doing the work
    private Status status;     // Optional: Defaults to TODO if not provided
}