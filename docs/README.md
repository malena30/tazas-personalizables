# Documentación del Proyecto: Tazas Personalizables

## Resumen Ejecutivo

**Tazas Personalizables** es una aplicación e-commerce fullstack para la venta de tazas personalizadas. El proyecto consta de un backend FastAPI (Python) y un frontend Next.js 16 (React 19, TypeScript) con diseño inspirado en Mercado Libre.

> 📖 **¿Primera vez leyendo esta documentación?** Consulta el [WALKTHROUGH.md](./WALKTHROUGH.md) para conocer el orden de lectura recomendado y guías por perfil (desarrollador, PM, onboarding).

---

## 📊 Arquitectura Global

### Stack Tecnológico

#### Backend
- **Framework**: FastAPI 
- **Base de Datos**: Pendiente de implementación (preparado para SQLAlchemy)
- **Cloud Storage**: Cloudinary (configurado en venv)

#### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Lenguaje**: TypeScript 5.9.3
- **Estilización**: Tailwind CSS v4 (Beta)
- **Estado Global**: Zustand 5.0.8
- **Iconos**: React Icons 5.5.0

### Flujos Principales

```mermaid
graph TD
    A[Usuario] --> B[Landing Page]
    B --> C[Catálogo/products]
    C --> D[Agregar al Carrito]
    D --> E[/cart]
    E --> F{¿Comprar?}
    F -->|Sí| G[/checkout]
    G --> H[BuyerForm]
    H --> I[ShippingOptions]
    I --> J[PaymentMethods]
    J--> K[OrderSummary]
    K --> L[Confirmar Orden]
    L --> M[Backend API]
    M --> N[Confirmación/Pago]
```

### Gestión de Estado

#### Zustand (Global)
- **cartStore**: Carrito de compras
  - Productos agregados
  - Cantidades
  - Costo de envío
  - Persistencia en localStorage

#### React Context (Checkout)
- **CheckoutContext**: Estado del flujo de checkout
  - Datos del comprador
  - Método de envío seleccionado
  - Método de pago
  - Cálculos de totales
  - Persistencia en localStorage

---

## 📁 Estructura del Repositorio

```
tazas-personalizables/
├── backend/
│   ├── main.py                    # Aplicación FastAPI
│   ├── database.py                # Configuración DB (vacío)
│   └── venv/                      # Entorno virtual Python
│
├── frontend/
│   ├── src/
│   │   ├── app/                   # App Router (Next.js 13+)
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── layout.tsx         # Layout raíz
│   │   │   ├── globals.css        # Estilos globales
│   │   │   ├── products/
│   │   │   │   └── page.tsx       # Catálogo
│   │   │   ├── cart/
│   │   │   │   └── page.tsx       # Carrito
│   │   │   └── checkout/
│   │   │       ├── layout.jsx     # Provider de contexto
│   │   │       ├── page.jsx       # Página checkout
│   │   │       └── components/
│   │   │           ├── BuyerForm.jsx
│ │   │           ├── ShippingOptions.jsx
│   │   │           ├── PaymentMethods.jsx
│   │   │           ├── OrderSummary.jsx
│   │   │           └── CheckoutSuccess.jsx
│   │   ├── components/            # Componentes compartidos
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── ShippingCalculator.tsx
│   │   │   └── CheckoutForm.tsx
│   │   ├── context/
│   │   │   └── CheckoutContext.jsx
│   │   ├── store/
│   │   │   └── cartStore.ts       # Zustand store
│   │   └── hooks/
│   │       └── useCheckout.js
│   ├── public/
│   │   └── sounds/
│   │       └── click.wav
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.js
│   └── eslint.config.mjs
│
└── docs/                          # ← Esta documentación
    ├── README.md                  # ← Estás aquí
    ├── backend/
    └── frontend/
```

---

## 📚 Índice Completo de Documentación

### Backend (2 archivos)

| Archivo | Descripción | Enlace |
|---------|-------------|--------|
| `main.py` | Aplicación FastAPI principal con endpoint de health check | [Documentación](./backend/main.py.md) |
| `database.py` | Configuración de base de datos ⚠️ Vacío | [Documentación](./backend/database.py.md) |

---

### Frontend - Páginas (8 archivos)

#### App Router

| Archivo | Ruta | Descripción | Enlace |
|---------|------|-------------|--------|
| `app/page.tsx` | `/` | Landing page con hero banner y productos destacados | [Documentación](./frontend/app/page.tsx.md) |
| `app/layout.tsx` | - | Layout raíz con Navbar, Footer y metadata SEO | [Documentación](./frontend/app/layout.tsx.md) |
| `app/products/page.tsx` | `/products` | Catálogo completo con filtros y agregar al carrito | [Documentación](./frontend/app/products/page.tsx.md) |
| `app/cart/page.tsx` | `/cart` | Carrito con edición de cantidades y cálculo de envío | [Documentación](./frontend/app/cart/page.tsx.md) |

#### Checkout Flow

| Archivo | Ruta | Descripción | Enlace |
|---------|------|-------------|--------|
| `app/checkout/layout.jsx` | - | Layout que provee CheckoutContext | [Documentación](./frontend/app/checkout/layout.jsx.md) |
| `app/checkout/page.jsx` | `/checkout` | Orquestador del flujo de checkout | [Documentación](./frontend/app/checkout/page.jsx.md) |

---

### Frontend - Componentes de Checkout (5 archivos)

| Archivo | Propósito | Enlace |
|---------|-----------|--------|
| `BuyerForm.jsx` | Formulario de datos del comprador | [Documentación](./frontend/app/checkout/components/BuyerForm.jsx.md) |
| `ShippingOptions.jsx` | Selección de método de envío | [Documentación](./frontend/app/checkout/components/ShippingOptions.jsx.md) |
| `PaymentMethods.jsx` | Selección de método de pago | [Documentación](./frontend/app/checkout/components/PaymentMethods.jsx.md) |
| `OrderSummary.jsx` | Resumen final y botón de confirmación | [Documentación](./frontend/app/checkout/components/OrderSummary.jsx.md) |
| `CheckoutSuccess.jsx` | Pantalla de confirmación ⚠️ Vacío | [Documentación](./frontend/app/checkout/components/CheckoutSuccess.jsx.md) |

---

### Frontend - Componentes Compartidos (5 archivos)

| Archivo | Propósito | Enlace |
|---------|-----------|--------|
| `Navbar.tsx` | Barra de navegación superior fija | [Documentación](./frontend/components/Navbar.tsx.md) |
| `Footer.tsx` | Pie de página con enlaces y copyright | [Documentación](./frontend/components/Footer.tsx.md) |
| `Cart.tsx` | Widget de carrito (versión simplificada) | [Documentación](./frontend/components/Cart.tsx.md) |
| `ShippingCalculator.tsx` | Calculadora de opciones/costos de envío | [Documentación](./frontend/components/ShippingCalculator.tsx.md) |
| `CheckoutForm.tsx` | Formulario unificado ⚠️ Vacío | [Documentación](./frontend/components/CheckoutForm.tsx.md) |

---

### Frontend - Estado y Contexto (3 archivos)

| Archivo | Tipo | Descripción | Enlace |
|---------|------|-------------|--------|
| `context/CheckoutContext.jsx` | Context API | Gestión de estado del checkout con localStorage | [Documentación](./frontend/context/CheckoutContext.jsx.md) |
| `store/cartStore.ts` | Zustand Store | Estado global del carrito con persistencia | [Documentación](./frontend/store/cartStore.ts.md) |
| `hooks/useCheckout.js` | Custom Hook | Re-exporta useCheckout ⚠️ Redundante | [Documentación](./frontend/hooks/useCheckout.js.md) |

---

### Frontend - Estilos (1 archivo)

| Archivo | Descripción | Enlace |
|---------|-------------|--------|
| `app/globals.css` | Estilos globales, variables CSS y configuración Tailwind | [Documentación](./frontend/app/globals.css.md) |

---

### Frontend - Configuración (5 archivos)

| Archivo | Propósito | Enlace |
|---------|-----------|--------|
| `package.json` | Dependencias y scripts del proyecto | [Documentación](./frontend/config/package.json.md) |
| `next.config.ts` | Configuración de Next.js (imágenes, strict mode) | [Documentación](./frontend/config/next.config.ts.md) |
| `tsconfig.json` | Configuración de TypeScript | [Documentación](./frontend/config/tsconfig.json.md) |
| `postcss.config.js` | Configuración de PostCSS y Tailwind | [Documentación](./frontend/config/postcss.config.js.md) |
| `eslint.config.mjs` | Reglas de linting y Web Vitals | [Documentación](./frontend/config/eslint.config.mjs.md) |

---

## 🎯 Funcionalidades Implementadas

### ✅ Completas

- [x] Landing page con diseño ML
- [x] Catálogo de productos con agregar al carrito
- [x] Carrito con edición de cantidades
- [x] Cálculo de envío por provincia
- [x] Persistencia de carrito en localStorage
- [x] Navbar responsive con contador
- [x] Footer con enlaces
- [x] Formularios de checkout (buyer, shipping, payment)
- [x] Cálculo de total dinámico
- [x] Optimización de imágenes con Next.js Image

### ⚠️ Parciales/Incompletas

- [ ] Backend con solo endpoint de health check
- [ ] Ruta `/customizer` (referenciada pero no existe)
- [ ] Integración de pago real (Mercado Pago deshabilitado)
- [ ] Confirmación de orden (sin handler de submit)
- [ ] Base de datos (archivo vacío)
- [ ] Dark mode (variables definidas pero no usadas)

---

## 🚧 Limitaciones y TODOs

### Backend

- **Sin implementación funcional**: Solo health check endpoint
- **Sin base de datos**: Archivo `database.py` vacío
- **Sin modelos**: No hay schemas de datos
- **Sin autenticación**: No implementada
- **Sin endpoints de negocio**: Productos, órdenes, pagos pendientes

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

- `/customizer` - Personalización de tazas
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

### Fase 3: Pagos y Customización
1. Integrar Mercado Pago SDK
2. Implementar `/customizer` con editor de imágenes
3. Aplicar descuento de efectivo en cálculos
4. Validaciones de formularios

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
