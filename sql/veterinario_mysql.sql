-- Tabla: roles
CREATE TABLE roles (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- Tabla: usuarios
CREATE TABLE usuarios (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(120) NOT NULL,
    rfc VARCHAR(20),
    correo VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    estado_activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(rol_id)
) ENGINE=InnoDB;

-- Tabla: permisos
CREATE TABLE permisos (
    permiso_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- Tabla: rol_permisos
CREATE TABLE rol_permisos (
    rol_id INT,
    permiso_id INT,
    PRIMARY KEY (rol_id, permiso_id),
  FOREIGN KEY (rol_id) REFERENCES roles(rol_id),
  FOREIGN KEY (permiso_id) REFERENCES permisos(permiso_id)
) ENGINE=InnoDB;

-- Tabla: dueños
CREATE TABLE duenos (
    dueno_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE,
    nombre_completo VARCHAR(120) NOT NULL,
    telefono VARCHAR(30),
    correo VARCHAR(120),
    direccion VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
) ENGINE=InnoDB;

-- Tabla: mascotas
CREATE TABLE mascotas (
    mascota_id INT AUTO_INCREMENT PRIMARY KEY,
    dueno_id INT NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    especie VARCHAR(60) NOT NULL,
    raza VARCHAR(80),
    sexo VARCHAR(1) DEFAULT 'U' CHECK (sexo IN ('M','F','U')),
    fecha_nacimiento DATE,
    color VARCHAR(60),
    microchip VARCHAR(60),
    esterilizado TINYINT(1),
    peso_kg DECIMAL(5,2),
    condiciones_cronicas TEXT,
    alergias TEXT,
    tipo_alimentacion VARCHAR(100),
    notas_adicionales TEXT,
	foto_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dueno_id) REFERENCES duenos(dueno_id)
) ENGINE=InnoDB;

-- Tabla: veterinarios
CREATE TABLE veterinarios (
    vet_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    cedula_profesional VARCHAR(60),
    especialidad VARCHAR(120),
    turno VARCHAR(20) CHECK (turno IN ('matutino','vespertino','nocturno')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
) ENGINE=InnoDB;

-- Tabla: recepcionistas
CREATE TABLE recepcionistas (
    recepcionista_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
) ENGINE=InnoDB;

-- Tabla: personal_laboratorio
CREATE TABLE personal_laboratorio (
    lab_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    certificacion VARCHAR(120),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
) ENGINE=InnoDB;

-- Tabla: citas
CREATE TABLE citas (
    cita_id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    dueno_id INT NOT NULL,
    vet_id INT,
    fecha_programada TIMESTAMP NOT NULL,
    tipo VARCHAR(20) DEFAULT 'consulta' CHECK (tipo IN ('consulta','vacunacion','control','cirugia','otro')),
    motivo VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada','confirmada','cancelada','no_asistio','atendida')),
    creado_por INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(mascota_id),
  FOREIGN KEY (dueno_id) REFERENCES duenos(dueno_id),
  FOREIGN KEY (vet_id) REFERENCES veterinarios(vet_id),
  FOREIGN KEY (creado_por) REFERENCES usuarios(usuario_id)
) ENGINE=InnoDB;

-- Tabla: niveles_triaje
CREATE TABLE niveles_triaje (
    triaje_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    prioridad INT NOT NULL,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- Tabla: urgencias
CREATE TABLE urgencias (
    urgencia_id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    dueno_id INT NOT NULL,
    triaje_id INT NOT NULL,
    fecha_llegada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sintomas TEXT,
    signos_vitales JSON,
    sala_asignada VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'en_espera' CHECK (estado IN ('en_espera','en_atencion','egresado','referido')),
    vet_asignado_id INT,
    creado_por INT NOT NULL,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(mascota_id),
  FOREIGN KEY (dueno_id) REFERENCES duenos(dueno_id),
  FOREIGN KEY (triaje_id) REFERENCES niveles_triaje(triaje_id),
  FOREIGN KEY (vet_asignado_id) REFERENCES veterinarios(vet_id),
  FOREIGN KEY (creado_por) REFERENCES usuarios(usuario_id)
) ENGINE=InnoDB;

-- Tabla: encuentros
CREATE TABLE encuentros (
    encuentro_id INT AUTO_INCREMENT PRIMARY KEY,--tipo de visita--,
    mascota_id INT NOT NULL,
    vet_id INT,
    cita_id INT,
    urgencia_id INT,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('consulta','urgencia','cirugia','seguimiento')),
    inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fin TIMESTAMP,
    notas TEXT,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(mascota_id),
  FOREIGN KEY (vet_id) REFERENCES veterinarios(vet_id),
  FOREIGN KEY (cita_id) REFERENCES citas(cita_id),
  FOREIGN KEY (urgencia_id) REFERENCES urgencias(urgencia_id)
) ENGINE=InnoDB;

-- Tabla: diagnosticos
CREATE TABLE diagnosticos (
    diagnostico_id INT AUTO_INCREMENT PRIMARY KEY,
    encuentro_id INT NOT NULL,--tipo de visita--,
    codigo VARCHAR(40),
    descripcion VARCHAR(255) NOT NULL,
    principal TINYINT(1) DEFAULT 0,
  FOREIGN KEY (encuentro_id) REFERENCES encuentros(encuentro_id)
) ENGINE=InnoDB;

-- Tabla: medicamentos
CREATE TABLE medicamentos (
    medicamento_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    via VARCHAR(60),
    fecha_inicio DATE,
    fecha_final DATE,
    estatus VARCHAR(20) DEFAULT 'activo' CHECK (estatus IN ('activo','suspendido','completado')),
    observaciones_reacciones TEXT,
    cantidad_sustancia VARCHAR(60)
) ENGINE=InnoDB;

-- Tabla: recetas
CREATE TABLE recetas (
    receta_id INT AUTO_INCREMENT PRIMARY KEY,
    encuentro_id INT NOT NULL,---tipo de visita--,
    medicamento_id INT NOT NULL,
    dosis VARCHAR(120) NOT NULL,
    frecuencia VARCHAR(120) NOT NULL,
    via VARCHAR(60),
    duracion_dias INT,
    notas VARCHAR(255),
  FOREIGN KEY (encuentro_id) REFERENCES encuentros(encuentro_id),
  FOREIGN KEY (medicamento_id) REFERENCES medicamentos(medicamento_id)
) ENGINE=InnoDB;

-- Tabla: estudios
CREATE TABLE estudios (
    estudio_id INT AUTO_INCREMENT PRIMARY KEY,
    encuentro_id INT NOT NULL,---tipo de visita--,
    solicitado_por INT,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('laboratorio','imagen')),
    modalidad VARCHAR(80),
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    muestra_tipo VARCHAR(50),
    muestra_id VARCHAR(50),
    fecha_toma DATE,
    estado VARCHAR(20) DEFAULT 'ordenado' CHECK (estado IN ('ordenado','en_proceso','reportado','cancelado')),
  FOREIGN KEY (encuentro_id) REFERENCES encuentros(encuentro_id),
  FOREIGN KEY (solicitado_por) REFERENCES veterinarios(vet_id)
) ENGINE=InnoDB;

-- Tabla: resultados_estudios
CREATE TABLE resultados_estudios (
    resultado_id INT AUTO_INCREMENT PRIMARY KEY,
    estudio_id INT NOT NULL,
    reportado_por INT,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultado_texto TEXT,
    archivo_url VARCHAR(255),
  FOREIGN KEY (estudio_id) REFERENCES estudios(estudio_id),
  FOREIGN KEY (reportado_por) REFERENCES personal_laboratorio(lab_id)
) ENGINE=InnoDB;

-- Tabla: documentos
CREATE TABLE documentos (
    documento_id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    encuentro_id INT,
    nombre_archivo VARCHAR(200) NOT NULL,
    tipo_archivo VARCHAR(80),
    url_almacenamiento VARCHAR(255) NOT NULL,
    subido_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(mascota_id),
  FOREIGN KEY (encuentro_id) REFERENCES encuentros(encuentro_id)
) ENGINE=InnoDB;

-- Tabla: bitacora_auditoria
CREATE TABLE bitacora_auditoria (
    auditoria_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    entidad VARCHAR(80) NOT NULL,
    id_entidad VARCHAR(80) NOT NULL,
    accion VARCHAR(10) NOT NULL CHECK (accion IN ('CREAR','ACTUALIZAR','BORRAR','CONSULTAR')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detalles JSON,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
) ENGINE=InnoDB;

-- Tabla: hospitalizaciones
CREATE TABLE hospitalizaciones (
    hospitalizacion_id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    vet_responsable_id INT,
    habitacion VARCHAR(50),
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_egreso TIMESTAMP,
    plan_cuidados TEXT,
    dietas_especiales TEXT,
    dispositivos_usos TEXT,
    estado VARCHAR(20) DEFAULT 'internado',
        CHECK (estado IN ('internado','alta','referido')),
  FOREIGN KEY (mascota_id) REFERENCES mascotas(mascota_id),
  FOREIGN KEY (vet_responsable_id) REFERENCES veterinarios(vet_id)
) ENGINE=InnoDB;