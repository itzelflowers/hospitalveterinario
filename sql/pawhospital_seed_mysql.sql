
-- pawhospital_seed_mysql.sql
-- Seed de ejemplo para Hospital Veterinario (MySQL 8)
-- Seguro para re-ejecutar: usa INSERT IGNORE / ON DUPLICATE KEY UPDATE y SELECTs.

START TRANSACTION;

-- ===== ROLES =====
INSERT IGNORE INTO roles (nombre, descripcion) VALUES
('admin','Acceso total al sistema'),
('vet','Veterinario con acceso clínico'),
('recepcion','Recepción/agenda y clientes');

-- ===== PERMISOS (ejemplo) =====
INSERT IGNORE INTO permisos (codigo, descripcion) VALUES
('clientes:ver','Ver dueños y mascotas'),
('clientes:editar','Editar dueños y mascotas'),
('citas:ver','Ver citas'),
('citas:crear','Crear citas'),
('citas:editar','Editar citas'),
('clinica:consultas','Registrar consultas y tratamientos'),
('admin:usuarios','Gestionar usuarios y roles');

-- Mapear permisos básicos a roles (si la tabla existe)
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.rol_id, p.permiso_id
FROM roles r
JOIN permisos p ON p.codigo IN ('clientes:ver','citas:ver')
WHERE r.nombre = 'recepcion'
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.rol_id, p.permiso_id
FROM roles r
JOIN permisos p ON p.codigo IN ('clientes:ver','clientes:editar','citas:ver','citas:crear','citas:editar','clinica:consultas')
WHERE r.nombre = 'vet'
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.rol_id, p.permiso_id
FROM roles r
JOIN permisos p
WHERE r.nombre = 'admin'
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

-- ===== USUARIOS =====
-- Nota: password_hash es de ejemplo, cámbialo cuando conectes el backend real.
INSERT IGNORE INTO usuarios (nombre_completo, rfc, correo, password_hash, rol_id, estado_activo)
SELECT 'Admin General', NULL, 'admin@pawhospital.local', '$2y$10$demoHashAdminxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', r.rol_id, 1
FROM roles r WHERE r.nombre='admin' LIMIT 1;

INSERT IGNORE INTO usuarios (nombre_completo, rfc, correo, password_hash, rol_id, estado_activo)
SELECT 'Dra. Rivera', NULL, 'rivera@pawhospital.local', '$2y$10$demoHashVetxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', r.rol_id, 1
FROM roles r WHERE r.nombre='vet' LIMIT 1;

INSERT IGNORE INTO usuarios (nombre_completo, rfc, correo, password_hash, rol_id, estado_activo)
SELECT 'Recepción', NULL, 'recepcion@pawhospital.local', '$2y$10$demoHashRecepxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', r.rol_id, 1
FROM roles r WHERE r.nombre='recepcion' LIMIT 1;

-- ===== DUEÑOS =====
INSERT IGNORE INTO duenos (usuario_id, nombre_completo, telefono, correo, direccion)
VALUES (NULL, 'Ana Pérez','555-123','ana@example.com','Av. Siempre Viva 123');

INSERT IGNORE INTO duenos (usuario_id, nombre_completo, telefono, correo, direccion)
VALUES (NULL, 'Luis Gómez','555-456','luis@example.com','Calle Luna 456');

-- ===== VETERINARIOS =====
INSERT IGNORE INTO veterinarios (nombre, cedula, especialidad, telefono, correo)
VALUES ('Dra. Rivera','VET-001','Felinos','555-777','rivera@pawhospital.local');

INSERT IGNORE INTO veterinarios (nombre, cedula, especialidad, telefono, correo)
VALUES ('Dr. Salas','VET-002','Caninos','555-888','salas@pawhospital.local');

-- ===== MASCOTAS =====
-- Michi (de Ana)
INSERT INTO mascotas (dueno_id, nombre, especie, raza, sexo, fecha_nacimiento, color, esterilizado)
SELECT d.dueno_id, 'Michi','gato','criollo','F','2021-05-01','gris', 1
FROM duenos d WHERE d.correo='ana@example.com'
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Firulais (de Luis)
INSERT INTO mascotas (dueno_id, nombre, especie, raza, sexo, fecha_nacimiento, color, esterilizado)
SELECT d.dueno_id, 'Firulais','perro','labrador','M','2020-09-15','dorado', 0
FROM duenos d WHERE d.correo='luis@example.com'
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- ===== CITAS =====
-- Cita para Michi con especialista felinos
INSERT INTO citas (mascota_id, dueno_id, vet_id, fecha_programada, tipo, motivo, estado, creado_por)
SELECT m.mascota_id, d.dueno_id, v.vet_id, NOW() + INTERVAL 2 DAY, 'consulta', 'Control general', 'programada',
       (SELECT u.usuario_id FROM usuarios u WHERE u.correo='recepcion@pawhospital.local' LIMIT 1)
FROM mascotas m
JOIN duenos d ON d.dueno_id=m.dueno_id
JOIN veterinarios v ON v.especialidad='Felinos'
WHERE m.nombre='Michi'
LIMIT 1
ON DUPLICATE KEY UPDATE estado = VALUES(estado);

-- Cita para Firulais con especialista caninos
INSERT INTO citas (mascota_id, dueno_id, vet_id, fecha_programada, tipo, motivo, estado, creado_por)
SELECT m.mascota_id, d.dueno_id, v.vet_id, NOW() + INTERVAL 3 DAY + INTERVAL 2 HOUR, 'vacunacion', 'Vacuna anual', 'programada',
       (SELECT u.usuario_id FROM usuarios u WHERE u.correo='recepcion@pawhospital.local' LIMIT 1)
FROM mascotas m
JOIN duenos d ON d.dueno_id=m.dueno_id
JOIN veterinarios v ON v.especialidad='Caninos'
WHERE m.nombre='Firulais'
LIMIT 1
ON DUPLICATE KEY UPDATE estado = VALUES(estado);

COMMIT;

-- ===== PRUEBAS RÁPIDAS =====
-- SELECT 'OK_DB' AS db_ok, DATABASE() AS db;
-- SELECT COUNT(*) AS total_tablas FROM information_schema.tables WHERE table_schema = DATABASE();
-- SELECT 'duenos' t, COUNT(*) c FROM duenos
-- UNION ALL SELECT 'veterinarios', COUNT(*) FROM veterinarios
-- UNION ALL SELECT 'mascotas', COUNT(*) FROM mascotas
-- UNION ALL SELECT 'citas', COUNT(*) FROM citas;
