CREATE TABLE IF NOT EXISTS incidents(
id UUID PRIMARY KEY,
title VARCHAR(120) NOT NULL,
 service VARCHAR(80) NOT NULL,
 severity VARCHAR(10) NOT NULL,
 status VARCHAR(15) NOT NULL,
  owner VARCHAR(80),
 summary VARCHAR(1000),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_service ON incidents (service);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents (severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);