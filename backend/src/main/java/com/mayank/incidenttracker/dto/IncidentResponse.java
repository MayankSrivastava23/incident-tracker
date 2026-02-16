package com.mayank.incidenttracker.dto;

import com.mayank.incidenttracker.entity.Severity;
import com.mayank.incidenttracker.entity.Status;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class IncidentResponse {
    private UUID id;
    private String title;
    private String service;
    private Severity severity;
    private Status status;
    private String owner;
    private String summary;
    private Instant createdAt;
    private Instant updatedAt;
}
