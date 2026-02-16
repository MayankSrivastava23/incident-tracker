package com.mayank.incidenttracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;
@Data
@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 80)
    private String service;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Status status;

    @Column(length = 80)
    private String owner;

    @Setter
    @Column(length = 1000)
    private String summary;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        if (id == null) id = UUID.randomUUID();
        var now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

//    public UUID getId() { return id; }
//    public void setId(UUID id) { this.id = id; }
//
//    public String getTitle() { return title; }
//    public void setTitle(String title) { this.title = title; }
//
//    public String getService() { return service; }
//    public void setService(String service) { this.service = service; }
//
//    public Severity getSeverity() { return severity; }
//    public void setSeverity(Severity severity) { this.severity = severity; }
//
//    public Status getStatus() { return status; }
//    public void setStatus(Status status) { this.status = status; }
//
//    public String getOwner() { return owner; }
//    public void setOwner(String owner) { this.owner = owner; }
//
//    public String getSummary() { return summary; }
//
//    public Instant getCreatedAt() { return createdAt; }
//    public Instant getUpdatedAt() { return updatedAt; }
}
