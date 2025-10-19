# 🏋️ FitZone - Sistema de Gestión de Gimnasio

Sistema completo de gestión para gimnasios con membresías, reservas, pagos con Stripe, y sistema de fidelización.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Testing](#testing)

---

## ✨ Características

### 💳 Sistema de Pagos
- Integración completa con Stripe
- Múltiples tipos de membresía (Básico, Premium, Elite)
- Procesamiento seguro de pagos
- Activación automática de membresías
- Historial de transacciones

### 👤 Gestión de Usuarios
- Autenticación con JWT
- Verificación OTP
- Roles: Miembro, Instructor, Recepcionista, Admin
- Perfiles personalizables
- Dashboard específico por rol

### 📅 Sistema de Reservas
- Reserva de clases y equipos
- Disponibilidad en tiempo real
- Notificaciones de reservas
- Historial de actividades

### 🎁 Sistema de Fidelización
- Acumulación de puntos
- Recompensas canjeables
- Sistema de niveles
- Seguimiento de progreso

### 🏢 Multi-sede
- Soporte para múltiples ubicaciones
- Gestión de sedes
- Asignación de sede principal
- Acceso según tipo de membresía

---

## 🔧 Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **npm** / **pnpm** / **yarn**: Gestor de paquetes
- **Git**: Para clonar el repositorio
- **Backend**: API de FitZone corriendo (ver documentación del backend)
- **Stripe Account**: Cuenta de prueba o producción

---

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/juan-david-lopez/front-proyecto.git
cd front-proyecto
```

### 2. Instalar Dependencias

```bash
# Con npm
npm install

# Con pnpm (recomendado)
pnpm install

# Con yarn
yarn install
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# Stripe (Obligatorio)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui

# API Backend (Obligatorio)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Opcionales
NEXT_PUBLIC_APP_NAME=FitZone
NEXT_PUBLIC_DEBUG_MODE=false
```

### 2. Obtener Claves de Stripe

1. Crear cuenta en [Stripe](https://stripe.com)
2. Ir al [Dashboard](https://dashboard.stripe.com/test/apikeys)
3. Copiar la **Publishable key** (pk_test_...)
4. Pegar en `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

⚠️ **Importante:** Nunca expongas la **Secret key** en el frontend.

---

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run dev
# o
pnpm dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Producción

```bash
# Crear build optimizado
npm run build

# Ejecutar en producción
npm run start
```

### Linting

```bash
# Verificar código
npm run lint

# Auto-fix de problemas
npm run lint:fix
```

---

## 📁 Estructura del Proyecto

```
front-proyecto/
├── app/                        # Páginas de Next.js (App Router)
│   ├── admin/                  # Dashboard de administrador
│   ├── checkout/               # Proceso de pago
│   ├── dashboard/              # Dashboard de usuario
│   │   ├── membresia/         # Gestión de membresía
│   │   ├── pagos/             # Historial de pagos
│   │   ├── reservas/          # Sistema de reservas
│   │   └── notificaciones/    # Centro de notificaciones
│   ├── instructor/             # Dashboard de instructor
│   ├── recepcion/             # Dashboard de recepcionista
│   ├── login/                 # Página de login
│   ├── register/              # Registro de usuarios
│   ├── membresias/            # Catálogo de planes
│   └── verify-otp/            # Verificación OTP
├── components/                 # Componentes reutilizables
│   ├── ui/                    # Componentes UI base (shadcn)
│   ├── stripe-payment-form.tsx # Formulario de pago Stripe
│   ├── navigation.tsx         # Barra de navegación
│   └── auth-guard.tsx         # Protección de rutas
├── contexts/                   # Contextos de React
│   └── auth-context.tsx       # Contexto de autenticación
├── services/                   # Servicios de API
│   ├── authService.ts         # Autenticación
│   ├── paymentService.ts      # Pagos con Stripe
│   ├── membershipService.ts   # Gestión de membresías
│   ├── reservationService.ts  # Sistema de reservas
│   └── userService.ts         # Gestión de usuarios
├── types/                      # Definiciones TypeScript
│   ├── user.ts                # Tipos de usuario
│   ├── membership.ts          # Tipos de membresía
│   ├── payment.ts             # Tipos de pago
│   └── reservation.ts         # Tipos de reserva
├── hooks/                      # Custom React Hooks
│   ├── use-auth.ts            # Hook de autenticación
│   ├── use-toast.ts           # Notificaciones toast
│   └── use-membership-notifications.ts
├── lib/                        # Utilidades
│   └── utils.ts               # Helpers generales
├── docs/                       # Documentación
│   ├── front.md               # Guía de integración Stripe
│   ├── IMPLEMENTACION_PAGOS_STRIPE.md
│   └── API_SPECIFICATION.md
└── public/                     # Archivos estáticos

```

---

## 📚 Documentación

### Documentación Principal
- **[Integración de Pagos](docs/front.md)** - Guía oficial del backend
- **[Implementación Stripe](docs/IMPLEMENTACION_PAGOS_STRIPE.md)** - Detalles de implementación
- **[API Specification](docs/API_SPECIFICATION.md)** - Contratos de API

### Flujos Principales
- **Registro de Usuario** → `docs/SEDE_OBLIGATORIA_EN_REGISTRO.md`
- **Sistema de Pagos** → `docs/IMPLEMENTACION_PAGOS_STRIPE.md`
- **Carga Dinámica de Sedes** → `docs/SEDES_DINAMICAS_REGISTRO.md`

---

## 🧪 Testing

### Tarjetas de Prueba de Stripe

#### Pago Exitoso ✅
```
Número: 4242 4242 4242 4242
Fecha: 12/25
CVC: 123
ZIP: 12345
```

#### Pago Fallido ❌
```
Número: 4000 0000 0000 0002
Fecha: 12/25
CVC: 123
```

#### Requiere 3D Secure 🔐
```
Número: 4000 0025 0000 3155
Fecha: 12/25
CVC: 123
```

### Usuarios de Prueba

```
Admin:
  Email: admin@fitzone.com
  Password: Admin123!

Miembro:
  Email: member@fitzone.com
  Password: Member123!
```

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **UI Library**: React 19
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Pagos**: Stripe
- **Autenticación**: JWT + OTP
- **State Management**: React Context
- **HTTP Client**: Fetch API
- **Formularios**: React Hook Form (en algunos componentes)
- **Validación**: Zod

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y pertenece a FitZone.

---

## 📞 Contacto y Soporte

- **Repository**: [github.com/juan-david-lopez/front-proyecto](https://github.com/juan-david-lopez/front-proyecto)
- **Issues**: [Reportar un problema](https://github.com/juan-david-lopez/front-proyecto/issues)
- **Backend Repository**: Solicitar al equipo de backend

---

## 🎯 Roadmap

- [x] Sistema de autenticación con JWT
- [x] Sistema de pagos con Stripe
- [x] Dashboard multi-rol
- [x] Sistema de reservas
- [x] Sistema de fidelización
- [x] Gestión de membresías
- [x] Multi-sede
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones Push
- [ ] Chat en vivo
- [ ] Integración con wearables
- [ ] App móvil nativa

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Última actualización:** 9 de octubre de 2025  
**Versión:** 3.0.0  
**Estado:** En desarrollo activo 🚀
