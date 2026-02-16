package com.mayank.incidenttracker.dto;

import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class ApiError {
    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<FieldViolation> violations;

    @Data
    public static class FieldViolation {
        private String field;
        private String message;

        public FieldViolation(String field, String message) {
            this.field = field;
            this.message = message;
        }
    }

    public ApiError(int status, String error, String message, String path, List<FieldViolation> violations) {
        this.timestamp = Instant.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.violations = violations;
    }
}
