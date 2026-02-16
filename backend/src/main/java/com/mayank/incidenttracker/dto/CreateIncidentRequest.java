package com.mayank.incidenttracker.dto;

import com.mayank.incidenttracker.entity.Severity;
import com.mayank.incidenttracker.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateIncidentRequest {

    @NotBlank
    @Size(min = 3, max = 120)
    private String title;

    @NotBlank
    @Size(min = 2, max = 80)
    private String service;

    @NotNull
    private Severity severity;

    @NotNull
    private Status status;

    @Size(max = 80)
    private String owner;

    @Size(max = 1000)
    private String summary;
}
