package com.mayank.incidenttracker.controller;

import com.mayank.incidenttracker.dto.CreateIncidentRequest;
import com.mayank.incidenttracker.dto.IncidentResponse;
import com.mayank.incidenttracker.dto.PageResponse;
import com.mayank.incidenttracker.dto.UpdateIncidentRequest;
import com.mayank.incidenttracker.entity.Severity;
import com.mayank.incidenttracker.entity.Status;
import com.mayank.incidenttracker.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService service;

    public IncidentController(IncidentService service) {
        this.service = service;
    }

    @PostMapping
    public IncidentResponse create(@Valid @RequestBody CreateIncidentRequest req) {
        return service.create(req);
    }

    @GetMapping
    public PageResponse<IncidentResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) Severity severity,
            @RequestParam(required = false) Status status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort.Direction dir = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return this.service.list(q, service, severity, status, page, size, Sort.by(dir, sortBy));
    }

    @GetMapping("/{id}")
    public IncidentResponse get(@PathVariable UUID id) {
        return service.getById(id);
    }

    @PatchMapping("/{id}")
    public IncidentResponse patch(@PathVariable UUID id, @Valid @RequestBody UpdateIncidentRequest req) {
        return service.patch(id, req);
    }
}
