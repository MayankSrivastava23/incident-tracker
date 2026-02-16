# Incident Tracker — Full Stack Mini App

A lightweight incident management system that allows engineers to create, browse, and manage production incidents.

## Features
- Create incidents with validation
- Browse incidents in a paginated table (**server-side pagination**)
- Search, filter, and sort incidents (**server-side**)
- View incident details
- Update incident fields (status/severity/owner/summary)
- Seed database with sample records (~200)

---

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

### Frontend
- Angular (Standalone components)
- Angular Material
- RxJS

---

# Project Structure

```
incident-tracker
 ┣ backend        → Spring Boot REST API
 ┗ frontend       → Angular UI
```

# Setup & Run Instructions

## 1️⃣ Clone Repository

```bash

git clone https://github.com/MayankSrivastava23/incident-tracker
cd incident-tracker
```

---

## 2️⃣ Backend Setup(Spring Boot + PostgreSQL)


### Create Database

```sql
CREATE DATABASE incident_tracker;
```
### Configure application.yml

```
server:
  port: 8080

spring:
  application:
    name: incident-tracker

  datasource:
    url: jdbc:postgresql://localhost:5432/incidents_db
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        format_sql: true
    open-in-view: false

  flyway:
    enabled: true

logging:
  level:
    org.hibernate.orm.connections.pooling: warn
    org.hibernate.SQL: info

```

---

### Run Backend

```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at:

```
http://localhost:8080
```

---

## 3️⃣ Frontend Setup (Angular)

5) Install deps and run
```
cd ../frontend
npm install
ng serve
```

Frontend runs at:
```
http://localhost:4200
```
Ensure backend is running before using the UI.
---
---
## API Overview

### 1. Create Incident
```
POST /api/incidents
```
```
Example body:

{
  "title": "Payment failures on checkout",
  "service": "Payments",
  "severity": "SEV2",
  "status": "OPEN",
  "owner": "Backend Team",
  "summary": "Spike in 5xx responses during checkout flow."
}
```

### 2. List Incidents (server-side pagination/filter/sort)

```
GET /api/incidents
```
### Query Parameters

| Parameter | Description |
|------------|------------|
| page       | Page number (1-based) |
| size       | Page size |
| q          | Search in title/summary |
| service    | Filter by service |
| severity   | Filter by severity |
| status     | Filter by status |
| sortBy     | Field to sort by (e.g. createdAt) |
| sortDir    | asc or desc |

#### Example:
```
GET /api/incidents?page=1&size=10&service=Payments&severity=SEV2&sortBy=createdAt&sortDir=desc
```
### 3. Get Incident By ID
```
GET /api/incidents/{id}
```
### 4. Update Incident (partial update)
```
PATCH /api/incidents/{id}
```
Example body:
```
{
  "status": "MITIGATED",
  "owner": "dev@team",
}
```
## Design Decisions & Tradeoffs

Server-side pagination, filtering, sorting: implemented to meet the requirement and scale for larger datasets.

Angular Material: chosen for clean UI components and fast iteration.

Form validation: enforced in both frontend and backend (defensive validation).

Simple query approach: prioritized readability and correctness over highly dynamic specifications for this scope.

## Tradeoffs:

Severity checkboxes in UI map to a single severity filter (if backend supports multi-select later, UI can send arrays).

## Improvements With More Time

Add authentication + role-based access (Admin/Engineer)

Add proper integration tests (Spring Boot Testcontainers + Angular tests)

Dockerize backend + frontend + postgres via docker-compose

Observability: structured logs, metrics, tracing

Better UX: toast notifications everywhere, improved empty/error states, optimistic UI updates


## Notes

The frontend UI was iterated quickly to match the assignment screenshots and focus on core functionality:
- Pagination
- Search
- Filtering
- Sorting
- Detail editing


## Key Highlights

*End-to-end full-stack implementation covering API design, database modeling, pagination logic, and frontend state management.
*Scalable backend architecture with clear separation of concerns (controller, service, repository) and defensive validation at multiple layers.
*Efficient server-side pagination, filtering, and sorting.

---

## Author

**Mayank Srivastava**

---
