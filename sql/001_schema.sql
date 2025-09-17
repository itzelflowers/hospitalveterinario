
-- sql/001_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre        VARCHAR(120) NOT NULL,
  telefono      VARCHAR(30),
  email         VARCHAR(120) UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS veterinarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre        VARCHAR(120) NOT NULL,
  cedula        VARCHAR(50),
  especialidad  VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS mascotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id    UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nombre        VARCHAR(120) NOT NULL,
  especie       VARCHAR(50)  NOT NULL,
  raza          VARCHAR(80),
  sexo          TEXT CHECK (sexo IN ('M','F')) NULL,
  fecha_nacimiento DATE NULL
);

CREATE TABLE IF NOT EXISTS citas (
  id BIGSERIAL PRIMARY KEY,
  mascota_id     UUID NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
  veterinario_id UUID NOT NULL REFERENCES veterinarios(id) ON DELETE RESTRICT,
  fecha          TIMESTAMPTZ NOT NULL,
  motivo         VARCHAR(255),
  estado         TEXT NOT NULL DEFAULT 'programada' CHECK (estado IN ('programada','completada','cancelada'))
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_vet_fecha ON citas(veterinario_id, fecha);
CREATE INDEX IF NOT EXISTS idx_mascotas_cliente ON mascotas(cliente_id);
