
-- ===============================================
-- Paw Hospital - Full Database Schema (MySQL 8+)
-- Focused on web application needs (RBAC, citas, urgencias, laboratorio, expediente)
-- Engine: InnoDB, Charset: utf8mb4
-- ===============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------- Seguridad / RBAC ----------
CREATE TABLE roles (
  role_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(50) NOT NULL UNIQUE,      -- administrador, veterinario, recepcion, laboratorio, cliente
  description   VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id       INT NOT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Permisos (opcional granular)
CREATE TABLE permissions (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(80) NOT NULL UNIQUE,
  description   VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE role_permissions (
  role_id       INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Dueños y Clientes ----------
CREATE TABLE owners (
  owner_id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NULL UNIQUE,                  -- si el dueño tiene cuenta de portal (rol=cliente)
  full_name     VARCHAR(120) NOT NULL,
  phone         VARCHAR(30),
  email         VARCHAR(120),
  address       VARCHAR(255),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  INDEX idx_owner_name (full_name),
  INDEX idx_owner_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Pacientes (Mascotas) ----------
CREATE TABLE pets (
  pet_id        INT AUTO_INCREMENT PRIMARY KEY,
  owner_id      INT NOT NULL,
  name          VARCHAR(80) NOT NULL,
  species       VARCHAR(60) NOT NULL,             -- perro, gato, etc.
  breed         VARCHAR(80),
  sex           ENUM('M','F','U') DEFAULT 'U',
  birth_date    DATE,
  color         VARCHAR(60),
  microchip     VARCHAR(60),
  is_neutered   TINYINT(1) DEFAULT NULL,
  notes         TEXT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owners(owner_id),
  INDEX idx_pet_name (name),
  INDEX idx_pet_owner (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Personal Clínico y Operativo ----------
CREATE TABLE veterinarians (
  vet_id        INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,              -- vínculo con users (rol=veterinario)
  license_no    VARCHAR(60),
  specialty     VARCHAR(120),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE receptionists (
  receptionist_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL UNIQUE,            -- rol=recepcion
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE lab_staff (
  lab_staff_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,              -- rol=laboratorio
  certification VARCHAR(120),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Citas ----------
CREATE TABLE appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  pet_id         INT NOT NULL,
  owner_id       INT NOT NULL,
  vet_id         INT NULL,
  scheduled_at   DATETIME NOT NULL,
  type           ENUM('consulta','vacunacion','control','cirugia','otro') DEFAULT 'consulta',
  reason         VARCHAR(255),
  status         ENUM('programada','confirmada','cancelada','no_asistio','atendida') DEFAULT 'programada',
  created_by     INT NOT NULL,                     -- user que creó la cita (recepcion/cliente)
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
  FOREIGN KEY (owner_id) REFERENCES owners(owner_id),
  FOREIGN KEY (vet_id) REFERENCES veterinarians(vet_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id),
  INDEX idx_appt_time (scheduled_at),
  INDEX idx_appt_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Urgencias y Triaje ----------
CREATE TABLE triage_levels (
  triage_level_id INT AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20) NOT NULL UNIQUE,     -- 'CRITICO','ALTO','MODERADO','BAJO'
  name            VARCHAR(60) NOT NULL,
  priority        TINYINT NOT NULL,                -- 1 = mayor prioridad
  description     VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE er_visits (
  er_visit_id     INT AUTO_INCREMENT PRIMARY KEY,
  pet_id          INT NOT NULL,
  owner_id        INT NOT NULL,
  triage_level_id INT NOT NULL,
  arrived_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  symptoms        TEXT,
  vitals_json     JSON NULL,                        -- FC, FR, T°, PA...
  status          ENUM('en_espera','en_atencion','egresado','referido') DEFAULT 'en_espera',
  assigned_vet_id INT NULL,
  created_by      INT NOT NULL,                     -- user que registró el ingreso
  FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
  FOREIGN KEY (owner_id) REFERENCES owners(owner_id),
  FOREIGN KEY (triage_level_id) REFERENCES triage_levels(triage_level_id),
  FOREIGN KEY (assigned_vet_id) REFERENCES veterinarians(vet_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id),
  INDEX idx_er_status (status),
  INDEX idx_er_triage (triage_level_id),
  INDEX idx_er_arrived (arrived_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Encuentros clínicos ----------
CREATE TABLE encounters (
  encounter_id   INT AUTO_INCREMENT PRIMARY KEY,
  pet_id         INT NOT NULL,
  vet_id         INT NULL,
  appointment_id INT NULL,
  er_visit_id    INT NULL,
  kind           ENUM('consulta','urgencia','cirugia','seguimiento') NOT NULL,
  start_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_at         DATETIME NULL,
  notes          TEXT,
  FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
  FOREIGN KEY (vet_id) REFERENCES veterinarians(vet_id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
  FOREIGN KEY (er_visit_id) REFERENCES er_visits(er_visit_id),
  INDEX idx_encounter_pet (pet_id),
  INDEX idx_encounter_kind (kind),
  INDEX idx_encounter_start (start_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE diagnoses (
  diagnosis_id   INT AUTO_INCREMENT PRIMARY KEY,
  encounter_id   INT NOT NULL,
  code           VARCHAR(40),                      -- SNOMED/ICD opcional
  description    VARCHAR(255) NOT NULL,
  is_primary     TINYINT(1) DEFAULT 0,
  FOREIGN KEY (encounter_id) REFERENCES encounters(encounter_id),
  INDEX idx_diag_encounter (encounter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Medicación y prescripciones ----------
CREATE TABLE medications (
  medication_id  INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  form           VARCHAR(60),                      -- tabletas, jarabe, inyectable...
  strength       VARCHAR(60),                      -- 50mg, 10mg/mL, etc.
  UNIQUE KEY uk_med (name, form, strength)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE prescriptions (
  prescription_id INT AUTO_INCREMENT PRIMARY KEY,
  encounter_id     INT NOT NULL,
  medication_id    INT NOT NULL,
  dosage           VARCHAR(120) NOT NULL,          -- 1 tableta
  frequency        VARCHAR(120) NOT NULL,          -- cada 12h
  route            VARCHAR(60),                    -- VO, IM, IV...
  duration_days    INT,
  notes            VARCHAR(255),
  FOREIGN KEY (encounter_id) REFERENCES encounters(encounter_id),
  FOREIGN KEY (medication_id) REFERENCES medications(medication_id),
  INDEX idx_rx_encounter (encounter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Estudios diagnósticos ----------
CREATE TABLE studies (
  study_id       INT AUTO_INCREMENT PRIMARY KEY,
  encounter_id   INT NOT NULL,
  requested_by   INT NULL,                         -- vet que solicita
  kind           ENUM('laboratorio','imagen') NOT NULL,
  modality       VARCHAR(80),                      -- Hemograma, RX, US, etc.
  ordered_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status         ENUM('ordenado','en_proceso','reportado','cancelado') DEFAULT 'ordenado',
  FOREIGN KEY (encounter_id) REFERENCES encounters(encounter_id),
  FOREIGN KEY (requested_by) REFERENCES veterinarians(vet_id),
  INDEX idx_study_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE study_results (
  result_id      INT AUTO_INCREMENT PRIMARY KEY,
  study_id       INT NOT NULL,
  reported_by    INT NULL,                         -- lab_staff opcional
  reported_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  result_text    TEXT,
  file_url       VARCHAR(255),                     -- ruta a PDF/imagen
  FOREIGN KEY (study_id) REFERENCES studies(study_id),
  FOREIGN KEY (reported_by) REFERENCES lab_staff(lab_staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Documentos del expediente ----------
CREATE TABLE documents (
  document_id    INT AUTO_INCREMENT PRIMARY KEY,
  pet_id         INT NOT NULL,
  encounter_id   INT NULL,
  file_name      VARCHAR(200) NOT NULL,
  file_type      VARCHAR(80),
  storage_url    VARCHAR(255) NOT NULL,
  uploaded_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
  FOREIGN KEY (encounter_id) REFERENCES encounters(encounter_id),
  INDEX idx_doc_pet (pet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Auditoría ----------
CREATE TABLE audit_logs (
  audit_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  entity_name    VARCHAR(80) NOT NULL,             -- tabla afectada
  entity_id      VARCHAR(80) NOT NULL,             -- PK como texto
  action         ENUM('CREATE','UPDATE','DELETE','READ') NOT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  details        JSON NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  INDEX idx_audit_entity (entity_name, entity_id),
  INDEX idx_audit_user_time (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Vistas útiles para la web ----------
CREATE OR REPLACE VIEW vw_appointments_calendar AS
SELECT a.appointment_id, p.name AS pet_name, o.full_name AS owner_name,
       v.vet_id, u.full_name AS vet_name, a.scheduled_at, a.type, a.status
FROM appointments a
JOIN pets p  ON p.pet_id = a.pet_id
JOIN owners o ON o.owner_id = a.owner_id
LEFT JOIN veterinarians v ON v.vet_id = a.vet_id
LEFT JOIN users u ON u.user_id = v.user_id;

CREATE OR REPLACE VIEW vw_er_board AS
SELECT e.er_visit_id, e.arrived_at, tl.code AS triage, tl.priority,
       p.name AS pet_name, o.full_name AS owner_name, e.status
FROM er_visits e
JOIN triage_levels tl ON tl.triage_level_id = e.triage_level_id
JOIN pets p ON p.pet_id = e.pet_id
JOIN owners o ON o.owner_id = e.owner_id;

SET FOREIGN_KEY_CHECKS = 1;
