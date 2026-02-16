package com.mayank.incidenttracker.dto;

import com.mayank.incidenttracker.entity.Severity;
import com.mayank.incidenttracker.entity.Status;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateIncidentRequest {
    private Status status;
    private Severity severity;
    @Size(max = 80)
    private String owner;
    @Size(max = 1000)
    private String summary;
}
