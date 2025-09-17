# 🐾 Hospital Veterinario – Proyecto Web

Este proyecto es una aplicación web para la gestión de un **hospital veterinario**, con base de datos en **MySQL**, levantada con **Docker Compose**.

---

## 🚀 Requisitos previos
- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/) instalados  
- Git instalado  
- (Opcional) PHP instalado localmente (`brew install php` en macOS) si quieres correr el `test_connection.php` fuera de Docker.

---

## 📦 Configuración inicial

1. Clonar el repo:
   ```bash
   git clone https://github.com/itzelflowers/hospitalveterinario.git
   cd hospitalveterinario
2. Levantar MySQL con Docker
 Para iniciar la base de datos:
   docker compose up -d
    Esto crea:
Contenedor MySQL con la base pawhospital
Tablas y datos iniciales (desde sql/001_schema.sql y sql/002_seed.sql)

 2.1 Reiniciar desde cero
  Si necesitas limpiar todo y volver a ejecutar migraciones/seed:
docker compose down -v
docker compose up -d

3. Probar conexión con PHP
 Hay un archivo backend/test_connection.php que hace una consulta de prueba a la base de datos.
  Local (si tienes PHP instalado)
  php -S 127.0.0.1:8000 -t backend
  Visita en navegador:  http://127.0.0.1:8000/test_connection.php
 Con Docker (si no tienes PHP instalado)
 Agrega este servicio a tu docker-compose.yml:
  php:
   image: php:8.2-cli
   container_name: pawhospital_php
  volumes:
    - ./backend:/var/www/html
  working_dir: /var/www/html
  ports:
    - "8000:8000"
  command: php -S 0.0.0.0:8000 -t /var/www/html
Levanta:
docker compose up -d php
Visita: http://127.0.0.1:8000/test_connection.php

4. Estructura del repo
hospitalveterinario/
├── backend/              # Código PHP (API de prueba)
│   └── test_connection.php
├── sql/                  # Scripts SQL (schema y seed)
│   ├── 001_schema.sql
│   └── 002_seed.sql
├── .env.example          # Variables de entorno (copia a .env)
├── docker-compose.yml    # Configuración de servicios
└── README.md             # Este archivo
