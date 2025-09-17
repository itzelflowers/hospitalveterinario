
# Veterinaria Web — Starter (PostgreSQL + Docker)

Este repo es un *kickstart* para tu proyecto colaborativo:
- **PostgreSQL 16** en Docker
- **Migrations/Seeds** en `sql/`
- Variables en `.env.example`
- Guía rápida para conectar con DBeaver/Postico/pgAdmin
- (Opcional) Script PHP de ejemplo (`backend/test_connection.php`)

## 0) Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)
- Un cliente SQL (recomiendo **DBeaver**: https://dbeaver.io/)

## 1) Levantar la base de datos
```bash
docker compose up -d
docker compose ps
# Espera a que el healthcheck pase a "healthy"
```

Verifica tablas con psql dentro del contenedor:
```bash
docker exec -it veterinaria_pg psql -U app -d veterinaria -c "\dt"
```

## 2) Conectar desde tu GUI
- **Host**: 127.0.0.1
- **Port**: 5432
- **Database**: veterinaria
- **User**: app
- **Password**: apppwd

## 3) Variables de entorno para tu app (ejemplo)
Copia `.env.example` a `.env` y ajusta si usas otro host/puerto (p. ej. en producción).
```env
DB_DRIVER=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=veterinaria
DB_USER=app
DB_PASS=apppwd
```

## 4) Probar conexión con PHP (opcional)
Archivo de ejemplo: `backend/test_connection.php`
```bash
# si tienes PHP local:
php -S 127.0.0.1:8000 -t backend
# abre http://127.0.0.1:8000/test_connection.php
```

## 5) Git: inicializar y subir a GitHub
- Crea un repo nuevo en GitHub (sin README ni .gitignore para evitar conflictos) p. ej. `veterinaria-web`.
- Luego en tu terminal, dentro de esta carpeta:

```bash
git init
git add .
git commit -m "feat: base Postgres + Docker + schema y seed"
git branch -M main
# Opción HTTPS
git remote add origin https://github.com/TU_USUARIO/veterinaria-web.git
# Opción SSH
# git remote add origin git@github.com:TU_USUARIO/veterinaria-web.git

git push -u origin main
```

## 6) Flujo de colaboración (migrations)
- Cada cambio de esquema = **nuevo archivo SQL** en `sql/`:
  - `003_add_tabla_inventario.sql`
  - `004_add_indexes.sql`
- Propón cambios vía **Pull Request** y describe qué hace tu migration.
- Para re‑aplicar seeds localmente, puedes ejecutar:
```bash
docker exec -i veterinaria_pg psql -U app -d veterinaria < sql/002_seed.sql
```

## 7) Staging en la nube (opcional)
- Crea Postgres en **Supabase** o **Neon**.
- Crea roles mínimos (solo lectura / lectura‑escritura) y comparte credenciales por `.env.example` (no subas contraseñas reales).

---

**¡Listo!** Con esto todo el equipo (Mac/Windows/Linux) levanta la misma BD. 
