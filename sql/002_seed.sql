
-- sql/002_seed.sql  (MySQL 8)
-- CLIENTES (ignora duplicados por email)
INSERT IGNORE INTO clientes (nombre, telefono, email) VALUES
('Ana Pérez','555-123','ana@example.com');

INSERT IGNORE INTO clientes (nombre, telefono, email) VALUES
('Luis Gómez','555-456','luis@example.com');

-- VETERINARIOS (ignora duplicados por cédula)
INSERT IGNORE INTO veterinarios (nombre, cedula, especialidad) VALUES
('Dra. Rivera','VET-001','Felinos'),
('Dr. Salas','VET-002','Caninos');

-- MASCOTAS (usa INSERT ... SELECT)
INSERT INTO mascotas (cliente_id, nombre, especie, raza, sexo, fecha_nacimiento)
SELECT c.id, 'Michi','gato','criollo','F','2021-05-01'
FROM clientes c WHERE c.email='ana@example.com'
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO mascotas (cliente_id, nombre, especie, raza, sexo, fecha_nacimiento)
SELECT c.id, 'Firulais','perro','labrador','M','2020-09-15'
FROM clientes c WHERE c.email='luis@example.com'
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- CITAS (ajusta si luego pones UNIQUE en alguna combinación de columnas)
INSERT INTO citas (mascota_id, veterinario_id, fecha, motivo)
SELECT m.id, v.id, NOW() + INTERVAL 4 DAY, 'Control general'
FROM mascotas m
JOIN veterinarios v ON v.especialidad='Felinos'
WHERE m.nombre='Michi'
ON DUPLICATE KEY UPDATE motivo = VALUES(motivo);

INSERT INTO citas (mascota_id, veterinario_id, fecha, motivo)
SELECT m.id, v.id, NOW() + INTERVAL 5 DAY + INTERVAL 2 HOUR, 'Vacunación'
FROM mascotas m
JOIN veterinarios v ON v.especialidad='Caninos'
WHERE m.nombre='Firulais'
ON DUPLICATE KEY UPDATE motivo = VALUES(motivo);
