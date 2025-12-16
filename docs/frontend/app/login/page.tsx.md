# Login Page (`/login`)

## Propósito

Página unificada para inicio de sesión y registro de nuevos usuarios.

## Características

- **Formulario Dual**: Permite alternar entre "Iniciar Sesión" y "Registrarse" con un botón.
- **Validación**: Campos requeridos, formato de email, longitud de contraseña.
- **Integración**: Usa `useAuth()` para comunicarse con el backend.
- **Feedback**: Muestra mensajes de error (ej: "Usuario ya existe", "Credenciales incorrectas").
- **Redirección**: Envía a `/customizer` tras un login exitoso.
- **Estilos**: Adaptable a tema claro/oscuro usando variables CSS (`var(--background)`, `var(--foreground)`).

## Componentes

- `LoginPage`: Componente principal (Client Component).
