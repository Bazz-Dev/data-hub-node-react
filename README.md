# Data Hub

Proyecto "Data Hub": una pequeña aplicación full-stack que combina un cliente React (Vite + Tailwind) con un servidor Node.js y conjuntos de datos CSV para gestionar y visualizar dashboards y consultas.

## Descripción

Esta codebase implementa un prototipo de panel de datos donde el frontend (cliente) está construido con React y Vite y el backend es un servidor Node.js ligero. Los datos iniciales están en CSV (`data/dashboards.csv`, `data/queries.csv`) y se consumen en la interfaz para mostrar dashboards, consultas y detalles relacionados.

**Características principales**

- **Visualización de Dashboards:** Vista principal con tarjetas y detalle de dashboards.
- **Gestión de Consultas:** Listado y modal de creación/visualización de consultas.
- **UI reutilizable:** Componentes UI como `Avatar`, `Badge`, `Button`, `Card`, `Input`, `Select`.

## Tecnologías

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js (servidor en `server/index.js`)
- **Datos:** CSV en la carpeta `data/`

## Estructura del proyecto

- **/client**: Aplicación React (Vite) con todos los componentes de UI y vistas.
  - `src/App.jsx`, `src/main.jsx`, `src/index.css`
  - `src/components/`: componentes de la UI y vistas principales (`DashboardsView.jsx`, `QueriesView.jsx`, `QueryModal.jsx`, `TopNav.jsx`, etc.)
  - `src/components/ui/`: librería de componentes reutilizables (`Avatar.jsx`, `Badge.jsx`, `Button.jsx`, `Card.jsx`, `Container.jsx`, `Input.jsx`, `Select.jsx`).
- **/server**: Servidor Node.js con `index.js`.
- **/data**: CSV con datasets iniciales: `dashboards.csv`, `queries.csv`.
- `package.json` (raíz) y `client/package.json` administran dependencias y scripts.

## Instalación y ejecución (local)

- **Node.js + npm 18+** instalados  
Verifica en PowerShell:
node -v
npm -v

npm install
npm --prefix client install
npm run dev

> En Windows PowerShell, si `npm` te falla por ExecutionPolicy, usa:
> - `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
> o ejecuta los comandos con `cmd /c`.


Levanta API (3000) + React (5173) con proxy a /api:

Abrir:
- UI: http://localhost:5173
- API health: http://localhost:3000/api/health

