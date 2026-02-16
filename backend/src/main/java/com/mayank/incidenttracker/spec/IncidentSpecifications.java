package com.mayank.incidenttracker.spec;

import com.mayank.incidenttracker.entity.Incident;
import com.mayank.incidenttracker.entity.Severity;
import com.mayank.incidenttracker.entity.Status;
import org.springframework.data.jpa.domain.Specification;

public class IncidentSpecifications {
    public static Specification<Incident> search(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return null;
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("summary")), like)
            );
        };
    }

    public static Specification<Incident> serviceEquals(String service) {
        return (root, query, cb) ->
                (service == null || service.isBlank()) ? null : cb.equal(root.get("service"), service);
    }

    public static Specification<Incident> severityEquals(Severity severity) {
        return (root, query, cb) -> severity == null ? null : cb.equal(root.get("severity"), severity);
    }

    public static Specification<Incident> statusEquals(Status status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
}
