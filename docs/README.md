# Documentación del Proyecto: Tazas Personalizables

## Resumen Ejecutivo

**Tazas Personalizables** es una aplicación e-commerce fullstack para la venta de tazas personalizadas. El proyecto consta de un backend FastAPI (Python) y un frontend Next.js 16 (React 19, TypeScript) con diseño inspirado en Mercado Libre.

> 📖 **¿Primera vez leyendo esta documentación?** Consulta el [WALKTHROUGH.md](./WALKTHROUGH.md) para conocer el orden de lectura recomendado y guías por perfil (desarrollador, PM, onboarding).

---

## 📊 Arquitectura Global

### Stack Tecnológico

#### Backend
- **Framework**: FastAPI 
- **Base de Datos**: SQLite (SQLAlchemy)
- **Autenticación**: JWT + OAuth2 (bcrypt)
- **Cloud Storage**: Cloudinary (configurado en venv)

#### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Lenguaje**: TypeScript 5.9.3
- **Estilización**: Tailwind CSS v4 (Beta)
- **Estado Global**: Zustand 5.0.8 (Carrito), Context API (Auth)
- **Iconos**: React Icons 5.5.0

### Flujos Principales

```mermaid
graph TD
    A[Usuario] --> B{¿Logueado?}
    B -->|No| C[Login/Register]
    C --> B
    B -->|Sí| D[Customizer]
    D --> E[Guardar Diseño]
    E --> F[Base de Datos]
    D --> G[Agregar al Carrito]
    G --> H[/cart]
    H --> I{¿Comprar?}
    I -->|Sí| J[/checkout]
    J --> K[Backend API]
```

### Gestión de Estado

#### Zustand (Global)
- **cartStore**: Carrito de compras
  - Productos agregados
  - Cantidades
  - Costo de envío
  - Persistencia en localStorage

#### React Context
- **AuthContext**: Estado de autenticación
  - Usuario actual
  - Token JWT
  - Login/Register/Logout
- **CheckoutContext**: Estado del flujo de checkout
  - Datos del comprador
  - Método de envío
  - Método de pago

---

## 📁 Estructura del Repositorio

```
tazas-personalizables/
├── backend/
│   ├── main.py                    # Aplicación FastAPI
│   ├── database.py                # Modelos SQLAlchemy (User, Design)
│   ├── auth.py                    # Lógica de autenticación (JWT, Hashing)
│   ├── schemas.py                 # Schemas Pydantic
│   └── venv/                      # Entorno virtual Python
│
├── frontend/
│   ├── src/
│   │   ├── app/                   # App Router (Next.js 13+)
│   │   │   ├── login/
│   │   │   │   └── page.tsx       # Login/Registro
│   │   │   ├── customizer/
│   │   │   │   └── page.tsx       # Personalizador de tazas
...
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # Contexto de autenticación
│   │   │   └── CheckoutContext.jsx
│   │   ├── lib/
│   │   │   └── api.ts             # Cliente API (Auth + Designs)
...
```

---

## 📚 Índice Completo de Documentación

### Backend (4 archivos)

| Archivo | Descripción | Enlace |
|---------|-------------|--------|
| `main.py` | API REST con endpoints de Auth y Diseños | [Documentación](./backend/main.py.md) |
| `database.py` | Modelos SQLAlchemy (User, Design) | [Documentación](./backend/database.py.md) |
| `auth.py` | Lógica de seguridad (JWT, Password Hashing) | [Documentación](./backend/auth.py.md) |
| `schemas.py` | Schemas de validación Pydantic | [Documentación](./backend/schemas.py.md) |

---

### Frontend - Páginas (9 archivos)

#### App Router

| Archivo | Ruta | Descripción | Enlace |
|---------|------|-------------|--------|
| `app/login/page.tsx` | `/login` | Formulario unificado de Login y Registro | [Documentación](./frontend/app/login/page.tsx.md) |
...

## 🎯 Funcionalidades Implementadas

### ✅ Completas

- [x] **Backend Completo**
  - [x] API REST con FastAPI
  - [x] Base de datos SQLite con SQLAlchemy
  - [x] Autenticación JWT (Login/Register)
  - [x] CRUD de Diseños (protegido por usuario)
- [x] **Frontend Auth**
  - [x] Página de Login/Registro
  - [x] Manejo de sesión global (AuthContext)
  - [x] Protección de rutas y API calls
- [x] **Personalizador de Tazas (/customizer)**
  - [x] Guardar/Cargar diseños en backend
  - [x] Canvas interactivo 3D
...

### ⚠️ Parciales/Incompletas

- [ ] Integración de pago real (Mercado Pago deshabilitado)
- [ ] Confirmación de orden (sin handler de submit)
- [ ] Dark mode (parcialmente implementado en Navbar/Login)

---

## 🚧 Limitaciones y TODOs

### Backend

- **Cloud Storage**: Thumbnails se guardan como Base64 o URL, falta integración robusta con Cloudinary.
- **Emails**: No hay envío de emails de confirmación.

### Frontend

- **Checkout**: Falta conectar con backend real de órdenes.


### Frontend

#### Estado y Validación

- **BuyerForm NO usa contexto**: Estado local desconectado
- **Sin validaciones**: Formularios no validan datos
- **Sin manejo de errores**: No hay feedback de errores
- **Descuento no aplicado**: Se muestra "10% descuento" pero no se calcula

#### Funcionalidad

- **Botón "Confirmar Compra" sin implementación**: No envía al backend
- **Productos hardcoded**: No vienen de API
- **Filtros no funcionales**: Solo visuales en `/products`
- **Mercado Pago deshabilitado**: Requires integración SDK

#### Rutas Faltantes

- `/checkout/success` - Confirmación de compra
- `/orders` - Historial de pedidos

### Configuración

- ⚠️ **React 19 RC**: Versión experimental, considerar downgrade a 18.x
- ⚠️ **Tailwind v4 Beta**: Puede tener bugs

---

## 🏗️ Patrones de Diseño Utilizados

### Frontend

1. **App Router (Next.js 13+)**: Enrutamiento basado en archivos
2. **Server/Client Components**: Optimización de rendering
3. **Nested Layouts**: Layout global + layout de checkout
4. **Context API**: CheckoutContext para estado de checkout
5. **Zustand Store**: cartStore para estado global del carrito
6. **Custom Hooks**: useCheckout para acceso a contexto
7. **Compound Components**: Checkout dividido en sub-componentes
8. **Controlled Components**: Formularios controlados con useState

### Backend

1. **RESTful API**: Arquitectura REST (pendiente de expandir)
2. **Dependency Injection**: Patrón de FastAPI (futuro)

---

## 🚀 Cómo Ejecutar

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload
```

**URL**: http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**URL**: http://localhost:3000

---

## 📝 Convenciones de Código

### TypeScript/JavaScript

- **Archivos**: PascalCase para componentes (`Navbar.tsx`), camelCase para utils
- **Componentes**: Functional components con hooks
- **Imports**: Alias `@/` para src
- **State**: Zustand para global, useState para local

### Python

- **Estilo**: PEP 8
- **Documentación**: Docstrings en funciones
- **Async**: Endpoints asíncronos en FastAPI

### CSS

- **Framework**: Tailwind CSS (utility-first)
- **Variables**: CSS custom properties en `:root`
- **Responsive**: Mobile-first con breakpoints Tailwind

---

## 🔮 Roadmap Sugerido

### Fase 1: Completar Backend
1. Implementar `database.py` con SQLAlchemy
2. Crear modelos (Product, Order, Customer)
3. Endpoints de productos (CRUD)
4. Endpoints de órdenes
5. Integración con Cloudinary para imágenes

### Fase 2: Conectar Frontend-Backend
1. Reemplazar datos hardcoded por API calls
2. Implementar handler de confirmación de compra
3. Crear página `/checkout/success`
4. Implementar historial de pedidos

### Fase 3: ~~Pagos y Customización~~ Pagos y Mejoras

1. Integrar Mercado Pago SDK
2. ~~Implementar `/customizer` con editor de imágenes~~ ✅ **Completado**
3. **Mejoras al Customizer**:
   - [ ] Guardar/cargar diseños en localStorage
   - [ ] Deshacer/Rehacer (Undo/Redo)
   - [ ] Galería de stickers/clipart predefinidos
   - [ ] Negrita/cursiva para textos
   - [ ] Más opciones de fuentes
   - [ ] Exportar múltiples vistas (4 lados de la taza)
4. Aplicar descuento de efectivo en cálculos
5. Validaciones de formularios

### Fase 4: Optimizaciones
1. Downgrade a React 18.x y Tailwind v3 para estabilidad
2. Implementar SEO avanzado
3. Agregar tests (Jest, Playwright)
4. Performance optimizations
5. Dark mode completo

---

## 📊 Estadísticas del Proyecto

### Archivos Documentados

- **Backend**: 2 archivos Python
- **Frontend**:
  - Páginas: 8 archivos
  - Componentes: 10 archivos
  - Estado/Contexto: 3 archivos
  - Estilos: 1 archivo
  - Configuración: 5 archivos

**Total**: **29 archivos documentados**

### Líneas de Código (aproximado)

- **Backend**: ~10 LOC (solo health check)
- **Frontend**: ~2,500 LOC
  - TypeScript/JavaScript: ~2,000 LOC
  - CSS: ~80 LOC
  - JSON: ~420 LOC

### Componentes React

- Pages: 6
- Layout components: 2
- UI Components: 10
- Context Providers: 1

---

## 📞 Soporte y Contacto

Para preguntas sobre esta documentación o el proyecto:

1. Revisa la documentación específica de cada archivo
2. Consulta los archivos relacionados mencionados
3. Verifica los TODOs y limitaciones conocidas

---

## 📄 Licencia

_Definir licencia del proyecto_

---

**Documentación generada el**: 2025-11-23

**Versión del proyecto**: 1.0.0

**Última actualización**: Primera versión completa de documentación
