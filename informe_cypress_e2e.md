# Informe Técnico: Arquitectura y Pruebas Automatizadas End-to-End (E2E)

**Proyecto:** DMGOTRAVEL  
**Módulo:** Aseguramiento de Calidad (QA) y Testing Automatizado  

---

## 1. Contexto del Negocio: ¿Qué es DMGOTRAVEL?

**DMGOTRAVEL** es una plataforma digital e-commerce enfocada en la industria del turismo, diseñada para conectar a viajeros con experiencias únicas (destinos y paquetes turísticos) en el corazón de los Andes.

El núcleo del modelo de negocio se basa en la autogestión y seguimiento de reservas turísticas. El flujo fundamental de operaciones involucra dos actores principales que interactúan constantemente:

1.  **El Cliente (Viajero):** Ingresa a la plataforma, explora un catálogo público de destinos o paquetes turísticos, visualiza detalles, fechas, capacidades, precios y procede a reservar y pagar su viaje mediante un formulario de Checkout. Además, cuenta con un panel privado (Dashboard) de autoservicio donde puede hacer seguimiento del estado de sus próximas aventuras (en espera, confirmadas o completadas) e incluso cancelar de forma autónoma.
2.  **El Administrador (Staff de DMGOTRAVEL):** Gestiona la logística operativa de la agencia a través de un panel de control privado y seguro. Su rol incluye supervisar el flujo de reservas entrantes (las cuales entran por defecto en estado "Pendiente"), verificar los datos del pasajero, validar pagos y finalmente confirmar o cancelar los itinerarios. 

Este modelo exige que ambos lados de la plataforma se comuniquen de manera perfecta. Si un cliente reserva, el administrador debe verlo inmediatamente en su panel de control; y cuando el administrador aprueba dicha reserva, el cliente debe notar el cambio de estado en tiempo real en su propio dashboard. Es precisamente garantizar la integridad de esta interacción bidireccional el objetivo principal de la implementación de pruebas automatizadas.

---

## 2. Stack Tecnológico del Sistema

Para soportar la lógica de negocio mencionada, el sistema DMGOTRAVEL está construido bajo una arquitectura moderna separada (Decoupled Architecture), utilizando las siguientes tecnologías principales:

*   **Frontend (Cliente/Interfaz):** **React.js** complementado con **Vite** para una compilación ultra rápida. React permite una renderización de interfaz de usuario dinámica y la gestión reactiva de estados para las vistas de administrador y clientes.
*   **Estilos:** **Tailwind CSS**, permitiendo el desarrollo rápido de interfaces consistentes usando un sistema de diseño basado en utilidades y diseño 100% responsivo para móviles y escritorio.
*   **Backend (API Rest / Lógica de Negocio):** **Laravel** (PHP). Un robusto framework MVC que se encarga de la persistencia de datos relacionales, enrutamiento, lógica de negocio profunda y el procesamiento del modelo de reservas.
*   **Autenticación:** **Laravel Sanctum** con protección basada en tokens (JWT) y cookies CSRF para operaciones seguras entre los puertos del frontend y backend (Cross-Origin).

---

## 3. ¿Qué son las Pruebas End-to-End (E2E)?

Las pruebas **End-to-End (De principio a fin)** son un método de prueba de software que valida el flujo de una aplicación desde el principio hasta el final, tal cual como lo haría un usuario humano real. 

A diferencia de las pruebas unitarias (que solo prueban funciones matemáticas o lógicas pequeñas de código aislado), el E2E abre un navegador web real, interactúa con la pantalla, hace clics en los botones, rellena formularios, navega por el enrutador de las páginas y verifica que todo el ecosistema integrado (Frontend, APIs, Enrutamiento) funcione en conjunto para entregar la experiencia final esperada.

---

## 4. ¿Qué es Cypress y por qué se eligió para DMGOTRAVEL?

**Cypress** es un framework líder en la industria de automatización de pruebas de frontend construido para la web moderna. A diferencia de tecnologías más antiguas, Cypress se ejecuta directamente dentro del navegador junto a la aplicación, otorgándole acceso nativo al DOM, memoria del navegador, y peticiones de red.

### Justificación Técnica de su uso en este proyecto:

1.  **Compatibilidad nativa con el Stack (React):** Dado que el frontend de DMGOTRAVEL está en JavaScript (React), Cypress utiliza la misma sintaxis, haciendo que las pruebas sean fáciles de entender, escalar y mantener.
2.  **Interceptación de Red (`cy.intercept`):** **Esta fue la razón más crítica para su elección.** Para cumplir el estricto requerimiento del proyecto de **"No ensuciar la base de datos de producción con datos de prueba"**, Cypress nos permitió interceptar cada llamada HTTP que el Frontend (React) intentaba hacer al Backend (Laravel). En lugar de escribir en la BD, Cypress capturaba el request y respondía inmediatamente con "Mock Data" (Datos simulados virtualmente). Así logramos probar el 100% de la lógica visual y de negocio del frontend sin insertar un solo byte falso en la base de datos real.
3.  **Viaje en el Tiempo (Time Travel):** Cypress toma una fotografía técnica (snapshot) en cada paso de la prueba. Esto nos permitió auditar visualmente los flujos complejos, como el llenado de tablas o la aparición de alertas.
4.  **Rapidez y Estabilidad:** Cypress elimina la "fragilidad" tradicional de las pruebas automatizadas (tiempos de espera forzados) al saber exactamente cuándo un elemento o petición asíncrona termina de cargar.

### 4.1. Comandos y Funciones Clave Utilizadas en DMGOTRAVEL

Para llevar a cabo las pruebas de manera profesional y lograr el aislamiento de la base de datos, se utilizaron intensivamente las siguientes APIs nativas de Cypress:

*   **`cy.intercept()`:** La herramienta más valiosa de este proyecto. Permite "secuestrar" o capturar las peticiones de red HTTP (GET, POST, PATCH) a nivel del navegador antes de que viajen al servidor. Con ella simulamos que el backend de Laravel respondía con éxito, inyectando respuestas de datos controladas y evitando alterar los registros reales.
*   **`cy.visit()`:** Comando utilizado para navegar a rutas específicas de la aplicación, como `/login` o `/client/dashboard`, inicializando el estado de la aplicación.
*   **`cy.get()` y `cy.contains()`:** Utilizados para escanear y localizar elementos de la interfaz. `cy.get` ubica elementos mediante selectores CSS estructurados, mientras que `cy.contains` busca texto humano visible en pantalla, simulando el rastreo visual del ojo del cliente.
*   **`.should('be.visible')` (Aserciones):** Es el verificador de calidad. No basta con que un dato exista oculto en el código fuente; esta aserción asegura matemáticamente que el elemento se haya renderizado en la interfaz y sea plenamente visible para el usuario.
*   **`.type()` y `.click()`:** Comandos de interacción pura. Simulan con exactitud milimétrica la digitación de un humano rellenando formularios y los eventos de clic del mouse sobre botones y componentes interactivos.
*   **`cy.wait()`:** Se usó en sinergia con `cy.intercept` utilizando "Alias" (ej. `cy.wait('@getReservations')`). Le ordena al robot pausar su ejecución y esperar inteligentemente a que la petición de red específica haya finalizado antes de continuar, evitando pruebas inestables (Flaky Tests).
*   **`cy.on('window:confirm', ...)`:** Comando avanzado de control de eventos del navegador. Se utilizó para interceptar las alertas emergentes nativas del navegador (pop-ups de confirmación) que lanza el sistema antes de cancelar una reserva, automatizando un "Aceptar" virtual para no bloquear el flujo de la prueba.

---

## 5. Batería de Pruebas Realizadas

Se diseñó e implementó una batería de pruebas E2E estructuradas en múltiples archivos, garantizando cobertura total de los flujos críticos del negocio.

### 5.1. Módulo de Autenticación (`auth.cy.js`)
*   **Objetivo:** Validar las barreras de seguridad y redireccionamiento por roles.
*   **Pruebas:**
    *   Simulación de login de Administrador y redirección al panel de control `/admin/dashboard`.
    *   Simulación de login de Cliente y redirección al catálogo de tours `/client/tourist-packages`.
    *   Validación de la correcta inyección de tokens y cookies de seguridad Sanctum (`csrf-cookie`).

### 5.2. Flujo Core de Reserva (`core-booking-flow.cy.js`)
*   **Objetivo:** Validar el "Happy Path" o camino feliz del modelo de negocio, desde la visión del viajero.
*   **Pruebas:**
    *   Cliente navega por el catálogo de destinos y paquetes turísticos.
    *   Interacción con la página de detalle del tour (selección de fecha).
    *   Llenado automático del formulario de Checkout y validación del resumen financiero.
    *   Simulación de la API de creación de reserva arrojando código de éxito `201 Created`.
    *   Redirección automática al dashboard comprobando que la reserva recién creada figura como "Pendiente".

### 5.3. Gestión Operativa del Administrador (`admin.cy.js`)
*   **Objetivo:** Validar la usabilidad y funciones del panel interno del staff de DMGOTRAVEL.
*   **Pruebas:**
    *   Renderizado de la tabla maestra interceptando respuestas de la API administrativa.
    *   Validación interactiva del sistema de filtros de estado (Pendientes vs Confirmadas).
    *   Prueba del comportamiento del diseño acordeón de la UI, haciendo clics programáticos en las filas agrupadas por meses de viaje.
    *   Apertura y validación del panel lateral (Side Panel) de detalles de pasajero.
    *   Simulación de Confirmación y Cancelación interceptando llamadas a la API mediante métodos `PATCH`.

### 5.4. Portal de Autoservicio del Cliente (`client-dashboard.cy.js`)
*   **Objetivo:** Garantizar la autonomía del viajero post-compra.
*   **Pruebas:**
    *   Visualización de métricas en tarjetas de resúmenes numéricos.
    *   Filtros interactivos separando los itinerarios futuros de los pasados/históricos.
    *   Manejo de la función de cancelación autónoma, controlando desde Cypress las interrupciones o popups nativos (`window.confirm`) del navegador.

### 5.5. Prueba Maestra Transversal (`full-lifecycle.cy.js`)
*   **Objetivo:** Prueba E2E definitiva cruzando fronteras de sesión, que integra a los dos actores simulando un ecosistema de compra-aprobación en vivo.
*   **Fases del Flujo:**
    *   **Fase 1:** El robot entra como Cliente y ejecuta una compra virtual (Mocking total).
    *   **Fase 2:** El robot cambia instantáneamente la memoria a la cuenta de Administrador, ubica la misma reserva comprada en la tabla y cambia su estado a "Confirmado".
    *   **Fase 3:** El robot retorna a la cuenta del cliente inicial, navega al dashboard, y el sistema aserta que la tarjeta de la reserva evolucionó dinámicamente de "Pendiente" a "Confirmada", probando el ciclo comercial con un éxito del 100%.

---

## 6. Proceso de Implementación de las Pruebas

La construcción de la suite de pruebas E2E se llevó a cabo siguiendo una metodología ágil y de ingeniería inversa, constando de las siguientes fases:

### 6.1. Configuración del Entorno y Preparación
- **Integración de Cypress:** Se incrustó Cypress al proyecto Frontend (React/Vite) como dependencia de desarrollo.
- **Parametrización de Rutas Base:** Se configuró el entorno local (`cypress.config.js`) estableciendo el dominio base del desarrollador (`http://localhost:5173`).
- **Desarrollo de Comandos Personalizados (Custom Commands):** Se modificó `cypress/support/commands.js` para crear las funciones `cy.loginAsAdmin()` y `cy.loginAsClient()`. Esto permitió acelerar masivamente los tiempos de prueba al inyectar directamente la autenticación en memoria (`localStorage`) sin tener que interactuar mecánicamente con pantallas de Login en cada archivo.

### 6.2. Auditoría de Código y Resolución de Seguridad (CORS)
- **Análisis de Lógica de UI:** Se practicó una lectura minuciosa a componentes críticos como `AdminReservations.jsx`, `ClientDashboard.jsx` y `<ProtectedRoute>`. El objetivo fue comprender el mapeo de objetos, arreglos y variables booleanas que requería React para renderizar las vistas sin caer en fallos fatales de variables nulas (Uncaught TypeErrors).
- **Traspaso de Seguridad Sanctum:** Dado que Laravel rechaza peticiones que no pasen la prueba CSRF, se tuvieron que implementar interceptores preventivos dirigidos a `**/sanctum/csrf-cookie`. Esto aseguró que las peticiones falsificadas del robot superaran los escudos de seguridad originados por llamadas Cross-Origin (de puerto 5173 a puerto 8000).

### 6.3. Estrategia de Simulación Total (Mocking Dinámico)
- **Diseño de Interceptores Multi-Ruta:** El sistema `cy.intercept` fue configurado agresivamente usando comodines (e.g. `**/api/admin/reservations`). Esto garantizó atrapar el 100% de los *requests* salientes desde React antes de que el navegador siquiera lograra contactar al backend físico.
- **Inyección de Estructuras Relacionales:** Los *mocks* JSON fueron creados para emular respuestas elaboradas de la base de datos (con propiedades anidadas tales como `client.name` o `service.title`), evitando así modificar el código fuente de producción para acomodarlo a la herramienta de testing.

### 6.4. Retos Abordados y Estabilización de UI
- **Despliegue de Componentes Dinámicos (Acordeones):** En el panel del Administrador, la tabla agrupa por defecto las reservas según los meses utilizando variables de estado. Cypress se programó para simular la lógica humana: ubicar primero la cabecera correspondiente al mes en cuestión y ejecutar un `.click()` programático antes de escanear o auditar el contenido escondido, simulando la experiencia visual de manera idéntica.
- **Bypass de Alertas Modales Nativas:** Se utilizó instrumentación de nivel profundo para interceptar los mensajes bloqueantes de JavaScript (`window.confirm`). A través de `cy.on('window:confirm', () => true)`, se instruyó al robot navegador aceptar silenciamente el diálogo de cancelación y proceder con la simulación de eliminación en base de datos.

---
*Documento Técnico Finalizado*
