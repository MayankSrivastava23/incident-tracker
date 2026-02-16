package com.mayank.incidenttracker.service;

import com.mayank.incidenttracker.dto.CreateIncidentRequest;
import com.mayank.incidenttracker.dto.IncidentResponse;
import com.mayank.incidenttracker.dto.PageResponse;
import com.mayank.incidenttracker.dto.UpdateIncidentRequest;
import com.mayank.incidenttracker.entity.Incident;
import com.mayank.incidenttracker.entity.Severity;
import com.mayank.incidenttracker.entity.Status;
import com.mayank.incidenttracker.exception.NotFoundException;
import com.mayank.incidenttracker.repository.IncidentRepository;
import com.mayank.incidenttracker.spec.IncidentSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class IncidentService {

    private final IncidentRepository repo;

    public IncidentService(IncidentRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public IncidentResponse create(CreateIncidentRequest req) {
        Incident i = new Incident();
        i.setTitle(req.getTitle());
        i.setService(req.getService());
        i.setSeverity(req.getSeverity());
        i.setStatus(req.getStatus());
        i.setOwner(req.getOwner());
        i.setSummary(req.getSummary());

        Incident saved = repo.save(i);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<IncidentResponse> list(
            String q,
            String service,
            Severity severity,
            Status status,
            int page,
            int size,
            Sort sort
    ) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), 100);

        Pageable pageable = PageRequest.of(safePage - 1, safeSize, sort);
        Specification<Incident> spec = Specification.allOf(
                IncidentSpecifications.search(q),
                IncidentSpecifications.serviceEquals(service),
                IncidentSpecifications.severityEquals(severity),
                IncidentSpecifications.statusEquals(status)
        );

        Page<Incident> result = repo.findAll(spec, pageable);

        PageResponse<IncidentResponse> resp = new PageResponse<>();
        resp.setItems(result.getContent().stream().map(this::toResponse).toList());
        resp.setPage(safePage);
        resp.setSize(safeSize);
        resp.setTotalItems(result.getTotalElements());
        resp.setTotalPages(result.getTotalPages());

        return resp;
    }

    @Transactional(readOnly = true)
    public IncidentResponse getById(UUID id) {
        Incident i = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Incident not found: " + id));
        return toResponse(i);
    }

    @Transactional
    public IncidentResponse patch(UUID id, UpdateIncidentRequest req) {
        Incident i = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Incident not found: " + id));

        if (req.getStatus() != null) i.setStatus(req.getStatus());
        if (req.getSeverity() != null) i.setSeverity(req.getSeverity());
        if (req.getOwner() != null) i.setOwner(req.getOwner());
        if (req.getSummary() != null) i.setSummary(req.getSummary());

        Incident saved = repo.save(i);
        return toResponse(saved);
    }

    private IncidentResponse toResponse(Incident i) {
        IncidentResponse r = new IncidentResponse();
        r.setId(i.getId());
        r.setTitle(i.getTitle());
        r.setService(i.getService());
        r.setSeverity(i.getSeverity());
        r.setStatus(i.getStatus());
        r.setOwner(i.getOwner());
        r.setSummary(i.getSummary());
        r.setCreatedAt(i.getCreatedAt());
        r.setUpdatedAt(i.getUpdatedAt());
        return r;
    }
}
