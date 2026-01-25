# Guía de Producción: Tazas Personalizables

Esta guía documenta todos los pasos realizados para preparar la aplicación para producción.

---

## 📋 Tabla de Contenidos

1. [SEO y Marketing](#seo-y-marketing)
2. [Páginas Legales y Cumplimiento](#páginas-legales-y-cumplimiento)
3. [Sistema de Emails con Resend](#sistema-de-emails-con-resend)
4. [Migración a PostgreSQL](#migración-a-postgresql)
5. [Optimización de Imágenes](#optimización-de-imágenes)
6. [Configuración de Webhook de Mercado Pago](#configuración-de-webhook-de-mercado-pago)
7. [Panel de Administración](#panel-de-administración)

---

## SEO y Marketing

### Implementación Completada

#### 1. Open Graph Image
- **Archivo**: `frontend/public/og-image.jpg`
- **Dimensiones**: 1200x630 pixels
- **Propósito**: Mejorar la apariencia al compartir en redes sociales

#### 2. Robots.txt
- **Archivo**: `frontend/src/app/robots.txt`
- **Configuración**: Permite todos los crawlers, incluye sitemap

```txt
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://tu-dominio.com/sitemap.xml
```

#### 3. Sitemap Dinámico
- **Archivo**: `frontend/src/app/sitemap.ts`
- **Rutas incluidas**: Home, Products, Terms, Privacy
- **Actualización**: Automática

#### 4. Metadata Optimizado
- **Archivo**: `frontend/src/app/layout.tsx`
- **Incluye**:
  - Title y description optimizados
  - Keywords relevantes
  - Open Graph tags
  - Twitter Card tags
  - Google Analytics (via `NEXT_PUBLIC_GA_ID`)

```tsx
export const metadata: Metadata = {
  title: "Tazas Personalizables - Diseña tu Taza Única",
  description: "Crea y personaliza tazas únicas con nuestro editor online...",
  keywords: ["tazas personalizadas", "regalos personalizados", ...],
  openGraph: {
    title: "Tazas Personalizables",
    description: "...",
    images: ["/og-image.jpg"],
  },
  // ...
};
```

---

## Páginas Legales y Cumplimiento

### Implementación Completada

#### 1. Términos y Condiciones
- **Ruta**: `/terms`
- **Archivo**: `frontend/src/app/terms/page.tsx`
- **Contenido**: Términos estándar para e-commerce

#### 2. Política de Privacidad
- **Ruta**: `/privacy`
- **Archivo**: `frontend/src/app/privacy/page.tsx`
- **Contenido**: Manejo de datos personales y cookies

#### 3. Cookie Banner
- **Componente**: `frontend/src/components/CookieBanner.tsx`
- **Almacenamiento**: localStorage (`cookieConsent`)
- **Comportamiento**: No intrusivo, se oculta al aceptar

```tsx
// Integrado en layout.tsx
<CookieBanner />
```

#### 4. Footer Actualizado
- **Archivo**: `frontend/src/components/Footer.tsx`
- **Enlaces añadidos**: Términos y Privacidad en sección "Legal"

---

## Sistema de Emails con Resend

### Implementación Completada

#### 1. Dependencia Añadida
```txt
# backend/requirements.txt
resend==2.4.0
```

#### 2. Configuración
- **Archivo**: `backend/email_utils.py`
- **Servicio Principal**: Resend
- **Fallback**: SMTP
- **Modo Simulación**: Si no hay credenciales

```python
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "onboarding@resend.dev")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY
```

#### 3. Plantillas de Email

| Tipo | Cuándo se Envía | Contenido |
|------|-----------------|-----------|
| **Welcome** | Registro de usuario | Bienvenida personalizada |
| **Order Confirmation** | Creación de orden | Detalles del pedido |
| **Payment Success** | Pago aprobado | Confirmación y seguimiento |

#### 4. Variables de Entorno

```bash
# backend/.env
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=tu-email@dominio.com
FRONTEND_URL=https://tu-dominio.com
```

### Cómo Usar

1. Crear cuenta en [resend.com](https://resend.com)
2. Obtener API Key
3. Configurar dominio (o usar `onboarding@resend.dev` para pruebas)
4. Añadir credenciales al `.env`

---

## Migración a PostgreSQL

### Implementación Completada

#### 1. Helper para JSONB
- **Archivo**: `backend/database.py`
- **Función**: `SmartJSON()`
- **Propósito**: Usar JSONB en PostgreSQL, JSON en SQLite

```python
def SmartJSON():
    return JSONB if DATABASE_URL.startswith("postgresql") else JSON
```

#### 2. Modelos Actualizados

Campos que ahora usan `SmartJSON()`:
- `User.addresses`
- `Design.elements`
- `Order.shipping_address`

#### 3. Pooling de Conexiones

```python
if DATABASE_URL.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    # PostgreSQL
    engine_args.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 3600,
        "pool_pre_ping": True,
    })
```

#### 4. Ejemplos de Conexión

```bash
# backend/ .env.example

# Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres

# Railway
DATABASE_URL=postgresql://postgres:[PASSWORD]@host.railway.app:5432/railway

# Neon
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]/neondb?sslmode=require
```

### Migración Step-by-Step

1. Crear base de datos PostgreSQL (Supabase/Railway/Neon)
2. Copiar Connection String
3. Actualizar `DATABASE_URL` en `.env`
4. Reiniciar backend (tablas se crean automáticamente)

---

## Optimización de Imágenes

### Implementación Completada

#### 1. Cloudinary Añadido
- **Archivo**: `frontend/next.config.ts`
- **Dominio**: `res.cloudinary.com`

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.pexels.com',
    },
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com', // ← Añadido
    },
  ],
},
```

#### 2. Beneficios

- ✅ Compresión automática
- ✅ Resize on-the-fly
- ✅ Formato moderno (WebP cuando el navegador lo soporta)
- ✅ Lazy loading nativo
- ✅ Optimizado para Core Web Vitals

#### 3. Componentes que ya usan `next/image`

- `ProductCard.tsx`
- `DesignLibrary.tsx`
- `Navbar.tsx`
- `Toolbar.tsx`
- Todas las páginas de producto

---

## Configuración de Webhook de Mercado Pago

### Estado Actual del Código

El código ya está **100% preparado** para recibir webhooks:

```python
# backend/payments.py (línea 43)
"notification_url": f"{BACKEND_URL}/api/payments/webhook"

# backend/main.py (línea 398)
@app.post("/api/payments/webhook")
async def mercadopago_webhook(request: Request, db: Session = Depends(get_db)):
    # Lógica de procesamiento
```

### Pasos para Configurar en Producción

#### 1. Desplegar Backend
- Railway, Render, o Heroku
- Ejemplo: `https://tazas-backend.railway.app`

#### 2. Configurar Variable de Entorno
```bash
BACKEND_URL=https://tazas-backend.railway.app
```

#### 3. Panel de Mercado Pago
1. Ir a https://www.mercadopago.com.ar/developers/panel
2. Seleccionar tu aplicación
3. Ir a "Webhooks"
4. Configurar URL: `https://tazas-backend.railway.app/api/payments/webhook`
5. Seleccionar evento: **Pagos**

#### 4. Cambiar a Producción
```bash
# Cambiar de Sandbox a Producción
MP_ACCESS_TOKEN=APP_USR-tu-token-de-produccion
```

### Testing

| Método | Cuándo Usar |
|--------|-------------|
| **Simulador de Webhooks** | Desarrollo local |
| **Tarjeta de Prueba** | Testing en Sandbox |
| **ngrok** | Testing local sin desplegar |

**Documento Completo**: Ver `webhook_guide.md` en artifacts

---

## Panel de Administración

### Funcionalidades Implementadas

#### 1. Dashboard
- Estadísticas generales
- Total de ventas
- Cantidad de órdenes (pagadas, pendientes)
- Usuarios totales
- Diseños creados

#### 2. Gestión de Órdenes
- Tabla con búsqueda y filtros
- Cambio de estado (pending, paid, failed)
- Visualización de cliente y monto

#### 3. Gestión de Usuarios
- Lista de clientes
- Actividad (órdenes y diseños por usuario)
- Rol (Admin/Cliente)

#### 4. Gestión de Productos (CRUD Completo)
- Crear productos
- Editar productos
- Eliminar productos
- Upload de imágenes
- Control de stock y estado (activo/inactivo)

### Acceso al Panel

#### Ruta
```
/admin
```

#### Crear el Primer Admin

1. Registrarse normalmente en `/register`
2. Ejecutar script desde el backend:

```bash
cd backend
python make_admin.py tu_usuario
```

3. Iniciar sesión en `/login`
4. Acceder a `/admin`

#### Protección
- Requiere autenticación JWT
- Requiere flag `is_admin = True`
- Redirección automática si no es admin

---

## Checklist de Producción

### Backend

- [x] PostgreSQL configurado
- [x] Resend integrado
- [x] Webhook de Mercado Pago listo
- [x] Variables de entorno documentadas
- [x] Admin panel funcional
- [ ] Tests implementados
- [ ] Logging configurado (Sentry)
- [ ] Rate limiting ajustado

### Frontend

- [x] SEO optimizado
- [x] Open Graph configurado
- [x] Sitemap generado
- [x] Robots.txt creado
- [x] Páginas legales (Terms, Privacy)
- [x] Cookie banner implementado
- [x] Imágenes optimizadas (next/image + Cloudinary)
- [x] Google Analytics integrado
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit

### Deployment

- [ ] Backend desplegado
- [ ] Frontend desplegado
- [ ] Base de datos PostgreSQL creada
- [ ] Variables de entorno configuradas
- [ ] Dominio personalizado
- [ ] SSL/HTTPS activado
- [ ] Webhook de MP configurado
- [ ] Primer admin creado

---

## Variables de Entorno Requeridas

### Backend (.env)

```bash
# Server
ENV=production
PORT=8000
BACKEND_URL=https://api.tu-dominio.com
FRONTEND_URL=https://tu-dominio.com
ALLOWED_ORIGINS=https://tu-dominio.com

# Security
SECRET_KEY=tu_clave_secreta_super_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Mercado Pago
MP_ACCESS_TOKEN=APP_USR-tu-token-de-produccion

# Email
RESEND_API_KEY=re_tu_api_key
EMAIL_FROM=hola@tu-dominio.com

# Monitoring
SENTRY_DSN=tu_sentry_dsn
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=tu_sentry_dsn
```

---

## Próximos Pasos

### Corto Plazo (1-2 semanas)
1. Desplegar backend y frontend
2. Configurar webhook de Mercado Pago
3. Crear primer admin
4. Cargar productos reales
5. Testing completo del flujo de compra

### Medio Plazo (1 mes)
1. Implementar analytics detallado
2. Agregar tests automatizados
3. Optimizar performance
4. Configurar backups de BD

### Largo Plazo (3+ meses)
1. Sistema de reviews/ratings
2. Programa de referidos
3. Múltiples métodos de pago
4. Internacionalización (i18n)

---

**Última actualización**: 2026-01-25  
**Versión**: 2.0 (Production-Ready)
