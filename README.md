# Sistema de Gestión de Turismo y Reservas DMGOTRAVEL

Este repositorio contiene el sistema de Gestión de Turismo y Reservas DMGOTRAVEL, una aplicación *full-stack* compuesta por una API backend robusta y una interfaz de usuario interactiva (Single Page Application).

## Stack Tecnológico

El sistema está dividido en dos componentes principales, cada uno utilizando tecnologías modernas y estándares de la industria:

### 1. Backend (API REST)
*   **Core:** Laravel 11 (PHP 8.2+)
*   **Base de Datos:** MariaDB
*   **Seguridad:** 
    *   Autenticación: Laravel Sanctum (Tokens API)
    *   Autorización: Spatie Laravel Permission (Roles y Permisos)
*   **Documentación:** L5 Swagger (OpenAPI/Swagger)
*   **Testing y Calidad de Código:** PHPUnit, Mockery, Faker, Laravel Pint (Code Style)

### 2. Frontend (Single Page Application)
*   **Core:** React 19
*   **Build Tool (Bundler):** Vite 8.1
*   **Enrutamiento:** React Router DOM 7.18
*   **Estilos:** Tailwind CSS 3.4 (con PostCSS y Autoprefixer)
*   **Cliente HTTP:** Axios 1.18
*   **Calidad de Código (Linter):** Oxlint 1.69

## Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas en tu entorno local:
*   [PHP](https://www.php.net/) (v8.2 o superior)
*   [Composer](https://getcomposer.org/) (Gestor de dependencias de PHP)
*   [Node.js](https://nodejs.org/) (v18 o superior) y npm
*   [MariaDB](https://mariadb.org/) (Servidor de base de datos)

## Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo local.

### 1. Configuración del Backend
Navega al directorio del backend y prepara la API:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Asegúrate de configurar las credenciales de tu base de datos MariaDB en el archivo nuevo `.env`. Luego, ejecuta las migraciones:

```bash
php artisan migrate --seed
php artisan serve
```
*La API estará disponible en `http://127.0.0.1:8000`.*

### 2. Configuración del Frontend
En una nueva sesión de terminal (desde la raíz del proyecto), navega al directorio del frontend y levanta la aplicación:

```bash
cd frontend
npm install
npm run dev
```
*La aplicación estará disponible en `http://127.0.0.1:5173/`.*

## Flujo de Desarrollo

Para el desarrollo local, ambos servidores (`php artisan serve` y `npm run dev`) deben ejecutarse simultáneamente en distintas sesiones de terminal. De esta manera, el frontend podrá consumir correctamente los endpoints de la API.
