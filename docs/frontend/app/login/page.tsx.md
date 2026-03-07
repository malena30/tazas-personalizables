# Login Page (`/login`)

## Propósito

Página unificada para inicio de sesión y registro de nuevos usuarios.

## Características

- **Formulario Dual**: Permite alternar entre "Iniciar Sesión" y "Registrarse" con un botón.
- **Validación**: Campos requeridos, formato de email, longitud de contraseña.
- **Integración**: Usa `useAuth()` para comunicarse con el backend.
- **Feedback**: Muestra mensajes de error (ej: "Usuario ya existe", "Credenciales incorrectas").
- **Redirección Dinámica**: Maneja el parámetro `redirect` en la URL para devolver al usuario a su página de origen (ej: `/checkout` o `/customizer`) tras un login exitoso. Por defecto redirige a `/customizer`.
- **Estilos**: Adaptable a tema claro/oscuro usando variables CSS (`var(--background)`, `var(--foreground)`).

## Componentes

- `LoginPage`: Componente principal (Client Component).
