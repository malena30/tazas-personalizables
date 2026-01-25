# README: Tazas Personalizables

> **Aplicación web completa** para diseñar, personalizar y comprar tazas personalizadas con editor 3D en tiempo real.

---

## 📋 Índice

- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Configuración y Deploy](#configuración-y-deploy)
- [Documentación](#documentación)
- [Estado del Proyecto](#estado-del-proyecto)

---

## 🚀 Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TailwindCSS 4
- **3D**: Three.js + React Three Fiber
- **State**: Zustand + Context API
- **Payments**: Mercado Pago Checkout Pro
- **Analytics**: Google Analytics, Sentry

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: SQLAlchemy
- **Auth**: JWT
- **Storage**: Cloudinary
- **Email**: Resend (con fallback SMTP)
- **Payments**: Mercado Pago SDK

---

## 📁 Estructura del Proyecto

```
tazas-personalizables/
├── frontend/
│   ├── src/
│   │   ├── app/              # Pages (Next.js App Router)
│   │   │   ├── page.tsx      # Landing
│   │   │   ├── products/     # Catálogo
│   │   │   ├── customizer/   # Editor 3D
│   │   │   ├── cart/         # Carrito
│   │   │   ├── checkout/     # Checkout
│   │   │   ├── admin/        # Panel admin
│   │   │   ├── profile/      # Perfil
│   │   │   ├── orders/       # Historial
│   │   │   ├── terms/        # Términos legales
│   │   │   └── privacy/      # Privacidad
│   │   ├── components/       # Componentes reutilizables
│   │   ├── context/          # Context API
│   │   ├── store/            # Zustand stores
│   │   ├── lib/              # API client y utilidades
│   │   └── data/             # Templates y datos estáticos
│   ├── public/               # Archivos estáticos
│   └── next.config.ts        # Configuración Next.js
│
├── backend/
│   ├── main.py              # FastAPI app
│   ├── database.py          # Modelos SQLAlchemy
│   ├── auth.py              # Autenticación JWT
│   ├── payments.py          # Mercado Pago
│   ├── email_utils.py       # Sistema de emails
│   ├── cloudinary_utils.py  # Upload de imágenes
│   ├── admin_utils.py       # Helpers para admin
│   ├── make_admin.py        # Script para crear admins
│   └── requirements.txt     # Dependencias Python
│
└── docs/
    ├── README.md            # Este archivo
    ├── PRODUCTION_GUIDE.md  # Guía de producción
    ├── WALKTHROUGH.md       # Sistema de diseño
    └── ...                  # Docs por componente
```

---

## ✨ Funcionalidades

### Para Usuarios

#### 🎨 Editor de Tazas 3D
- Vista 3D interactiva con rotación libre
- Agregar texto con fuentes personalizadas
- Cargar imágenes y stickers
- Colores de taza personalizables
- Guardar y cargar diseños
- Preview en tiempo real

#### 🛒 E-commerce Completo
- Catálogo de productos
- Carrito de compras persistente
- Checkout integrado con Mercado Pago
- Historial de órdenes
- Perfil de usuario con direcciones guardadas

#### 🔐 Autenticación
- Registro y login
- JWT tokens
- Sesiones persistentes
- Protección de rutas

### Para Administradores

#### 📊 Dashboard
- Estadísticas de ventas
- Total de órdenes y usuarios
- Diseños creados
- Actividad reciente

#### 🗂️ Gestión
- **Productos**: CRUD completo con imágenes
- **Órdenes**: Actualización de estado
- **Usuarios**: Visualización y estadísticas

---

## ⚙️ Configuración y Deploy

### Setup Local

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Editar .env.local con tus credenciales
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Editar .env con tus credenciales
uvicorn main:app --reload
```

### Variables de Entorno

Ver ejemplos completos en:
- `frontend/.env.example`
- `backend/.env.example`

Credenciales necesarias:
- Cloudinary (para imágenes)
- Mercado Pago (para pagos)
- Resend (para emails)
- PostgreSQL (para producción)

### Deploy a Producción

Ver guía completa: [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md)

**Servicios recomendados**:
- Frontend: Vercel
- Backend: Railway / Render
- Database: Supabase / Neon
- Email: Resend

---

## 📚 Documentación

### Guías

| Documento | Descripción |
|-----------|-------------|
| [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) | Guía completa de producción |
| [WALKTHROUGH.md](./WALKTHROUGH.md) | Sistema de diseño y componentes |
| [webhook_guide.md](../.gemini/antigravity/brain/.../webhook_guide.md) | Configuración de webhooks MP |

### Documentación por Componente

Cada componente y página tiene su documentación en `docs/frontend/` y `docs/backend/`.

---

## 🎯 Estado del Proyecto

### ✅ Completado

#### SEO y Marketing
- ✅ Open Graph image
- ✅ Sitemap dinámico
- ✅ Robots.txt
- ✅ Metadata optimizado
- ✅ Google Analytics

#### Legal e
 Cumplimiento
- ✅ Términos y Condiciones
- ✅ Política de Privacidad
- ✅ Cookie Banner
- ✅ Links en Footer

#### Infraestructura
- ✅ Sistema de emails (Resend)
- ✅ PostgreSQL optimizado (JSONB, pooling)
- ✅ Optimización de imágenes (next/image + Cloudinary)
- ✅ Webhook de Mercado Pago (listo para configurar)

#### Features
- ✅ Editor 3D funcional
- ✅ Carrito persistente
- ✅ Checkout completo
- ✅ Panel de admin
- ✅ Autenticación JWT
- ✅ Páginas de producto detalladas
- ✅ Historial de órdenes
- ✅ Perfil de usuario

### 🚧 Pendiente

#### Testing
- ⏳ Tests unitarios
- ⏳ Tests de integración
- ⏳ E2E tests

#### Performance
- ⏳ Lighthouse audit
- ⏳ Core Web Vitals optimization
- ⏳ Bundle size reduction

#### Features Futuros
- ⏳ Sistema de reviews
- ⏳ Programa de referidos
- ⏳ Múltiples métodos de pago
- ⏳ Internacionalización (i18n)
- ⏳ Búsqueda y filtros avanzados

---

## 🤝 Contribuir

### Workflow
1. Fork el repositorio
2. Crear branch feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add: nueva funcionalidad'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Convenciones de Código
- **Frontend**: ESLint + Prettier
- **Backend**: PEP 8
- **Commits**: Conventional Commits

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

## 👥 Equipo

Desarrollado con ❤️ para crear la mejor experiencia de personalización de tazas.

---

**Última actualización**: 2026-01-25  
**Versión**: 2.0
