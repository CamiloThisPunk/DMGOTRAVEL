# Sistema de Gestión de Turismo y Reservas DMGOTRAVEL

Este repositorio contiene el sistema de Gestión de Turismo y Reservas DMGOTRAVEL, una aplicación *full-stack* compuesta por una API backend basada en Laravel y un frontend basado en React.

## Arquitectura del Sistema

El sistema está dividido en dos componentes principales:

### 1. API Backend (`/backend`)
*   **Lenguaje:** PHP 8.2+
*   **Framework Principal:** Laravel 11
*   **Autenticación:** Laravel Sanctum
*   **Autorización y Roles:** Spatie Laravel Permission
*   **Documentación API:** L5 Swagger (Swagger/OpenAPI)
*   **Base de Datos:** Configurada mediante `.env` (típicamente MySQL/PostgreSQL/SQLite)
*   **Testing:** PHPUnit, Mockery, Faker
*   **Herramientas de Desarrollo:** Laravel Pint (Linter/Code Style), Laravel IDE Helper, Collision

### 2. Aplicación Frontend (`/frontend`)
*   **Librería Principal:** React 19
*   **Construcción y Servidor:** Vite 8.1 (@vitejs/plugin-react)
*   **Estilos:** Tailwind CSS 3.4, PostCSS 8.5, Autoprefixer 10.5
*   **Enrutamiento:** React Router DOM 7.18
*   **Cliente HTTP:** Axios 1.18
*   **Herramientas de Desarrollo / Linter:** Oxlint 1.69

## Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente instalado en tu máquina:
*   [PHP](https://www.php.net/) (v8.2 o superior)
*   [Composer](https://getcomposer.org/) (Gestor de dependencias de PHP)
*   [Node.js](https://nodejs.org/) (v18 o superior recomendado) y npm
*   Un sistema de base de datos relacional (ej. MySQL, PostgreSQL)

## Instalación y Configuración

Sigue estos pasos para poner el proyecto en marcha en tu entorno local.

### 1. Configuración del Backend
1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias de PHP:
   ```bash
   composer install
   ```
3. Configura las variables de entorno:
   Copia el archivo de entorno de ejemplo y configura tu conexión a la base de datos y otros ajustes.
   ```bash
   cp .env.example .env
   ```
4. Genera la clave de la aplicación:
   ```bash
   php artisan key:generate
   ```
5. Ejecuta las migraciones de la base de datos (y opcionalmente los seeders):
   ```bash
   php artisan migrate --seed
   ```
6. Inicia el servidor de desarrollo local del backend:
   ```bash
   php artisan serve
   ```
   *La API estará disponible en `http://127.0.0.1:8000`.*

### 2. Configuración del Frontend
1. Abre una nueva ventana o pestaña en la terminal y navega al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Node:
   ```bash
   npm install
   ```
3. Copia las variables de entorno (si existe el archivo de ejemplo):
   ```bash
   cp .env.example .env
   ```
4. Inicia el servidor de desarrollo del frontend:
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible en `http://127.0.0.1:5173/`.*

## Flujo de Desarrollo

Para trabajar en este proyecto localmente, debes mantener los servidores de desarrollo tanto del backend como del frontend ejecutándose simultáneamente en sesiones de terminal separadas.
