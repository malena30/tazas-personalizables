# AuthContext.tsx

## Propósito

Provee el estado global de autenticación para toda la aplicación usando React Context API.

## Estado (Context Value)

- `user`: Objeto `User` actual o `null`.
- `token`: String JWT o `null`.
- `loading`: Boolean (true mientras verifica sesión inicial).

## Funciones Expuestas

- `login(username, password)`: Autentica al usuario y guarda sesión.
- `register(username, email, password)`: Crea cuenta y hace auto-login.
- `logout()`: Cierra sesión y limpia datos.

## Persistencia

- Usa `localStorage` para guardar `auth_token` y `auth_user`.
- Al iniciar la app (`useEffect`), verifica si existe un token y lo valida contra el backend (`/auth/me`).

## Uso

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, logout } = useAuth();
  
  if (user) {
    return <button onClick={logout}>Salir {user.username}</button>;
  }
  return <span>No logueado</span>;
}
```
