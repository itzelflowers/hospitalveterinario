
-- sql/002_seed.sql
INSERT INTO clientes (nombre, telefono, email) VALUES
('Ana Pérez','555-123','ana@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO clientes (nombre, telefono, email) VALUES
('Luis Gómez','555-456','luis@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO veterinarios (nombre, cedula, especialidad) VALUES
('Dra. Rivera','VET-001','Felinos'),
('Dr. Salas','VET-002','Caninos')
ON CONFLICT DO NOTHING;

WITH a AS (
  SELECT id FROM clientes WHERE email='ana@example.com'
), l AS (
  SELECT id FROM clientes WHERE email='luis@example.com'
)
INSERT INTO mascotas (cliente_id, nombre, especie, raza, sexo, fecha_nacimiento)
VALUES
((SELECT id FROM a),'Michi','gato','criollo','F','2021-05-01'),
((SELECT id FROM l),'Firulais','perro','labrador','M','2020-09-15')
ON CONFLICT DO NOTHING;

INSERT INTO citas (mascota_id, veterinario_id, fecha, motivo)
SELECT m.id, v.id, now() + interval '4 days', 'Control general'
FROM mascotas m JOIN veterinarios v ON v.especialidad='Felinos'
WHERE m.nombre='Michi'
ON CONFLICT DO NOTHING;

INSERT INTO citas (mascota_id, veterinario_id, fecha, motivo)
SELECT m.id, v.id, now() + interval '5 days 2 hours', 'Vacunación'
FROM mascotas m JOIN veterinarios v ON v.especialidad='Caninos'
WHERE m.nombre='Firulais'
ON CONFLICT DO NOTHING;
