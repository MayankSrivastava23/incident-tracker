package com.mayank.incidenttracker.util;

import org.springframework.stereotype.Component;
import com.mayank.incidenttracker.entity.*;
import com.mayank.incidenttracker.repository.IncidentRepository;
import org.springframework.boot.CommandLineRunner;

import java.util.List;
import java.util.Random;

@Component
public class SeedDataRunner implements CommandLineRunner {

    private final IncidentRepository repo;

    public SeedDataRunner(IncidentRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() >= 200) return;

        Random r = new Random();
        List<String> services = List.of("Payments", "Auth", "Search", "Orders", "Notifications", "Billing");
        List<String> owners = List.of("Mayank", "Oncall-A", "Oncall-B", "SRE", "Backend-Team", "QA");

        for (int i = (int) repo.count(); i < 200; i++) {
            Incident inc = new Incident();
            inc.setTitle(sampleTitle(r, i));
            inc.setService(services.get(r.nextInt(services.size())));
            inc.setSeverity(Severity.values()[r.nextInt(Severity.values().length)]);
            inc.setStatus(Status.values()[r.nextInt(Status.values().length)]);
            inc.setOwner(owners.get(r.nextInt(owners.size())));
            inc.setSummary("Auto-seeded incident #" + (i + 1) + " for demo/testing.");
            repo.save(inc);
        }
    }

    private String sampleTitle(Random r, int i) {
        String[] templates = {
                "Timeout spike in API",
                "High error rate on service",
                "DB connection pool exhausted",
                "Latency regression after deploy",
                "Unexpected 500 responses",
                "Queue consumer lag increasing"
        };
        return templates[r.nextInt(templates.length)] + " (" + (i + 1) + ")";
    }
}
