-- 02_seed.sql
-- Seed de ejemplo para Hospital Veterinario (MySQL 8)
-- CORREGIDO para ser compatible con el esquema 'veterinario_mysql.sql'
-- Seguro para re-ejecutar: usa INSERT IGNORE / ON DUPLICATE KEY UPDATE.

START TRANSACTION;

-- =========================================================
--  1. ROLES Y PERMISOS (sin cambios)
-- =========================================================
INSERT IGNORE INTO roles (nombre, descripcion) VALUES
('admin','Acceso total al sistema'),
('vet','Veterinario con acceso clínico'),
('recepcion','Recepción/agenda y clientes');

INSERT IGNORE INTO permisos (codigo, descripcion) VALUES
('clientes:ver','Ver dueños y mascotas'),
('clientes:editar','Editar dueños y mascotas'),
('citas:ver','Ver citas'),
('citas:crear','Crear citas'),
('citas:editar','Editar citas'),
('clinica:consultas','Registrar consultas y tratamientos'),
('admin:usuarios','Gestionar usuarios y roles');

INSERT IGNORE INTO rol_permisos (rol_id, permiso_id)
SELECT r.rol_id, p.permiso_id FROM roles r, permisos p WHERE r.nombre = 'admin';

INSERT IGNORE INTO rol_permisos (rol_id, permiso_id)
SELECT r.rol_id, p.permiso_id FROM roles r JOIN permisos p ON p.codigo IN ('clientes:ver','clientes:editar','citas:ver','citas:crear','citas:editar','clinica:consultas') WHERE r.nombre = 'vet';

INSERT IGNORE INTO rol_permisos (rol_id, permiso_id)
SELECT r.rol_id, p.permiso_id FROM roles r JOIN permisos p ON p.codigo IN ('clientes:ver','citas:ver') WHERE r.nombre = 'recepcion';

-- =========================================================
--  2. USUARIOS
-- =========================================================
-- Nota: password_hash es de ejemplo, cámbialo cuando conectes el backend real.
-- Creamos el usuario Administrador
INSERT IGNORE INTO usuarios (nombre_completo, correo, password_hash, rol_id)
SELECT 'Admin General', 'admin@pawhospital.local', '$2a$10$KwW6xub3y4s9eOVdTteW.ePL7uzVK54vt8PApkrxt9zFNgc4RJuDe', r.rol_id
FROM roles r WHERE r.nombre='admin';

-- Creamos los usuarios para los VETERINARIOS
INSERT IGNORE INTO usuarios (nombre_completo, correo, password_hash, rol_id)
SELECT 'Dra. Rivera', 'rivera@pawhospital.local', '$2a$10$KwW6xub3y4s9eOVdTteW.ePL7uzVK54vt8PApkrxt9zFNgc4RJuDe', r.rol_id
FROM roles r WHERE r.nombre='vet';

INSERT IGNORE INTO usuarios (nombre_completo, correo, password_hash, rol_id)
SELECT 'Dr. Salas', 'salas@pawhospital.local', '$2a$10$KwW6xub3y4s9eOVdTteW.ePL7uzVK54vt8PApkrxt9zFNgc4RJuDe', r.rol_id
FROM roles r WHERE r.nombre='vet';

-- Creamos el usuario para RECEPCIÓN (era necesario para crear citas)
INSERT IGNORE INTO usuarios (nombre_completo, correo, password_hash, rol_id)
SELECT 'Recepcionista Turno 1', 'recepcion@pawhospital.local', '$2a$10$KwW6xub3y4s9eOVdTteW.ePL7uzVK54vt8PApkrxt9zFNgc4RJuDe', r.rol_id
FROM roles r WHERE r.nombre='recepcion';


-- =========================================================
--  3. PERFILES DE EMPLEADOS (Veterinarios, Recepcionistas)
-- =========================================================
-- Ahora creamos el perfil de VETERINARIO, vinculándolo al usuario correspondiente
INSERT IGNORE INTO veterinarios (usuario_id, cedula_profesional, especialidad, turno)
SELECT u.usuario_id, 'VET-001', 'Felinos', 'matutino'
FROM usuarios u WHERE u.correo='rivera@pawhospital.local';

INSERT IGNORE INTO veterinarios (usuario_id, cedula_profesional, especialidad, turno)
SELECT u.usuario_id, 'VET-002', 'Caninos', 'vespertino'
FROM usuarios u WHERE u.correo='salas@pawhospital.local';

-- Creamos el perfil de RECEPCIONISTA
INSERT IGNORE INTO recepcionistas (usuario_id)
SELECT u.usuario_id
FROM usuarios u WHERE u.correo='recepcion@pawhospital.local';

-- =========================================================
--  4. DUEÑOS Y MASCOTAS
-- =========================================================
INSERT IGNORE INTO duenos (nombre_completo, telefono, correo, direccion) VALUES
('Ana Pérez','555-123','ana@example.com','Av. Siempre Viva 123'),
('Luis Gómez','555-456','luis@example.com','Calle Luna 456');

-- Se inserta 'Michi' buscando el ID de su dueña 'Ana Pérez'
INSERT IGNORE INTO mascotas (dueno_id, nombre, especie, raza, sexo, fecha_nacimiento, color, esterilizado)
SELECT d.dueno_id, 'Michi','gato','criollo','F','2021-05-01','gris', 1
FROM duenos d WHERE d.correo='ana@example.com';

-- Se inserta 'Firulais' buscando el ID de su dueño 'Luis Gómez'
INSERT IGNORE INTO mascotas (dueno_id, nombre, especie, raza, sexo, fecha_nacimiento, color, esterilizado)
SELECT d.dueno_id, 'Firulais','perro','labrador','M','2020-09-15','dorado', 0
FROM duenos d WHERE d.correo='luis@example.com';

-- =========================================================
--  5. CITAS
-- =========================================================
-- Cita para Michi con la veterinaria especialista en felinos
INSERT IGNORE INTO citas (mascota_id, dueno_id, vet_id, fecha_programada, tipo, motivo, estado, creado_por)
SELECT
    (SELECT mascota_id FROM mascotas WHERE nombre = 'Michi' LIMIT 1),
    (SELECT dueno_id FROM duenos WHERE correo = 'ana@example.com' LIMIT 1),
    (SELECT vet_id FROM veterinarios WHERE especialidad = 'Felinos' LIMIT 1),
    NOW() + INTERVAL 2 DAY,
    'consulta',
    'Control general',
    'programada',
    (SELECT usuario_id FROM usuarios WHERE correo = 'recepcion@pawhospital.local' LIMIT 1);

-- Cita para Firulais con el veterinario especialista en caninos
INSERT IGNORE INTO citas (mascota_id, dueno_id, vet_id, fecha_programada, tipo, motivo, estado, creado_por)
SELECT
    (SELECT mascota_id FROM mascotas WHERE nombre = 'Firulais' LIMIT 1),
    (SELECT dueno_id FROM duenos WHERE correo = 'luis@example.com' LIMIT 1),
    (SELECT vet_id FROM veterinarios WHERE especialidad = 'Caninos' LIMIT 1),
    NOW() + INTERVAL 3 DAY + INTERVAL 2 HOUR,
    'vacunacion',
    'Vacuna anual',
    'programada',
    (SELECT usuario_id FROM usuarios WHERE correo = 'recepcion@pawhospital.local' LIMIT 1);

COMMIT;