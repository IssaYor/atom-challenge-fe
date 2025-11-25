## ATOM TASKS — Frontend (Angular 17 Standalone)

    Administrador de tareas moderno, accesible y totalmente responsive.

    Este proyecto corresponde al frontend del desafío Atom Challenge, desarrollado con Angular 17, Material Design, arquitectura modular, pruebas unitarias completas y despliegue automático en Firebase Hosting mediante GitHub Actions.

## Tecnologías principales

    Angular 17 (Standalone)
    TypeScript
    RxJS
    Angular Material
    SCSS modular
    Karma + Jasmine (Unit tests)
    Firebase Hosting
    GitHub Actions (CI/CD)
    JWT + Interceptors

## Estructura de carpetas

    src/
    ├── app/
    │   ├── core/
    │   │   ├── interceptors/
    │   │   ├── models/
    │   │   ├── services/
    │   │   └── guards/
    │   │
    │   ├── shared/
    │   │   ├── components/
    │   │   ├── services/
    │   │   └── directives/
    │   │
    │   ├── features/
    │   │   ├── auth/
    │   │   └── tasks/
    │   │       ├── pages/
    │   │       └── components/
    │   │
    │   ├── app.routes.ts
    │   └── app.config.ts
    │
    ├── assets/
    │   ├── images/
    │   └── styles/
    │
    ├── environments/
    └── main.ts

## Funcionalidades implementadas
    # Autenticación moderna

    Login basado en email.

    Manejo automático de usuario no encontrado (abre modal para crear cuenta).

    Persistencia de sesión.

    Logout seguro.

    Interceptor global para enviar token JWT.

    # Gestión completa de tareas

    ✔ Listar tareas
    ✔ Crear tareas
    ✔ Editar
    ✔ Eliminar
    ✔ Marcar como completadas
    ✔ Contadores de estados
    ✔ Reinicio automático del formulario
    ✔ Notificaciones globales (snackbar)


## Componentes desarrollados
   # LoginPageComponent
        Pantalla de autenticación con formulario reactivo, estilos modernos y accesibilidad.

   # TaskListPageComponent

    Página principal del sistema:

        Integra formulario + listado
        Controla el estado (loading, saving, editing)
        Consume TaskService
        Maneja eventos internos

   # TaskFormComponent

        Crear y editar tareas
        Validaciones en tiempo real
        Reset automático mediante signal

   # TaskListComponent

        Renderizado dinámico
        Tooltips inteligentes
        Truncamiento de texto
        Botón "Ver más" con tooltip al hacer click
        Diseño responsive

## Pruebas unitarias
   # Cubrimiento:
        Servicios
        AuthService
        TaskService

   # Componentes:
        LoginPageComponent
        TaskListComponent
        TaskFormComponent
        TaskListPageComponent

   # Se probaron:
        Estados de carga
        Emisión de eventos
        Validaciones
        Llamadas HTTP mockeadas
        Renderizado condicional
        Interceptor de token

   # Comando en CI:
        npm run test:ci

## Integración Continua (CI/CD) — GitHub Actions + Firebase Hosting

  # El proyecto incluye un pipeline completo para:

     Instalar dependencias
     Ejecutar pruebas unitarias
     Construir la app Angular
     Desplegar automáticamente a Firebase Hosting
     Cada vez que se hace push al branch main.

## Secretos requeridos

  # En GitHub debes configurar:

    Variable: FIREBASE_TOKEN
    Descripción: Token de servicio generado con firebase login:ci 
