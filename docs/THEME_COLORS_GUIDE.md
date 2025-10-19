# 🎨 Guía de Colores del Sistema de Temas - FitZone

## Descripción General
FitZone implementa un sistema de temas dual (claro/oscuro) con colores que se adaptan automáticamente según la preferencia del usuario. Todos los colores están optimizados para cumplir con los estándares de accesibilidad WCAG AA.

## 🌓 Temas Disponibles

### Tema Oscuro (Por Defecto)
- **Fondo principal**: Negro profundo (#000000)
- **Fondo secundario**: Gris muy oscuro (#0a0a0a)
- **Texto principal**: Blanco (#ffffff)
- **Texto secundario**: Gris claro (#b3b3b3)
- **Bordes**: Gris oscuro (#333333)

### Tema Claro
- **Fondo principal**: Blanco (#ffffff)
- **Fondo secundario**: Gris muy claro (#fafafa)
- **Texto principal**: Negro (#0a0a0a)
- **Texto secundario**: Gris medio oscuro (#4a4a4a)
- **Bordes**: Gris claro (#e0e0e0)

## 📋 Variables CSS Disponibles

### Fondos
```css
var(--fitzone-bg-primary)      /* Fondo principal */
var(--fitzone-bg-secondary)    /* Fondo secundario */
var(--fitzone-bg-tertiary)     /* Fondo terciario */
```

### Textos
```css
var(--fitzone-text-primary)    /* Texto principal */
var(--fitzone-text-secondary)  /* Texto secundario */
var(--fitzone-text-muted)      /* Texto atenuado */
```

### Colores de Marca
```css
var(--fitzone-red-primary)     /* Rojo principal FitZone */
var(--fitzone-red-secondary)   /* Rojo secundario */
var(--fitzone-red-hover)       /* Rojo hover */
```

### Bordes
```css
var(--fitzone-border-primary)   /* Borde principal */
var(--fitzone-border-secondary) /* Borde secundario */
```

### Estados
```css
var(--fitzone-success)  /* Verde éxito */
var(--fitzone-warning)  /* Naranja advertencia */
var(--fitzone-error)    /* Rojo error */
var(--fitzone-info)     /* Azul información */
```

## 🛠️ Clases de Utilidad

### Fondos Adaptativos
```html
<!-- Fondos que cambian automáticamente con el tema -->
<div class="bg-theme-primary">Fondo principal</div>
<div class="bg-theme-secondary">Fondo secundario</div>
<div class="bg-theme-tertiary">Fondo terciario</div>
```

### Textos Adaptativos
```html
<!-- Textos que se ajustan al tema actual -->
<h1 class="text-theme-primary">Título principal</h1>
<p class="text-theme-secondary">Texto secundario</p>
<span class="text-theme-muted">Texto atenuado</span>
```

### Cards Adaptativos
```html
<!-- Cards que se adaptan automáticamente -->
<div class="card-theme p-6 rounded-lg">
  <h2>Título de la card</h2>
  <p>Contenido que se adapta al tema</p>
</div>
```

### Bordes Adaptativos
```html
<!-- Bordes que cambian con el tema -->
<div class="border-theme border-2">Con borde principal</div>
<div class="border-theme-secondary border">Con borde secundario</div>
```

### Botones Adaptativos
```html
<!-- Botones con estilos temáticos -->
<button class="btn-theme-primary">Botón principal</button>
<button class="btn-theme-secondary">Botón secundario</button>
```

### Estados
```html
<!-- Colores de estado que se adaptan -->
<span class="success-theme">✓ Éxito</span>
<span class="warning-theme">⚠ Advertencia</span>
<span class="error-theme">✗ Error</span>
<span class="info-theme">ℹ Información</span>
```

### Inputs Adaptativos
```html
<!-- Inputs que cambian con el tema -->
<input class="input-theme" type="text" placeholder="Escribe aquí..." />
```

### Hover States
```html
<!-- Elementos con hover adaptativo -->
<div class="hover-theme cursor-pointer">
  Pasa el mouse por aquí
</div>
```

## 📊 Comparativa de Colores

| Elemento | Tema Oscuro | Tema Claro |
|----------|-------------|------------|
| Fondo principal | #000000 (Negro) | #ffffff (Blanco) |
| Fondo secundario | #0a0a0a | #fafafa |
| Texto principal | #ffffff (Blanco) | #0a0a0a (Negro) |
| Texto secundario | #b3b3b3 | #4a4a4a |
| Rojo FitZone | #ef4444 | #dc2626 |
| Bordes | #333333 | #e0e0e0 |
| Success | #22c55e | #16a34a |
| Warning | #f59e0b | #d97706 |
| Error | #ef4444 | #dc2626 |
| Info | #3b82f6 | #2563eb |

## ✅ Mejores Prácticas

### 1. Usa Variables CSS en lugar de Colores Hardcoded
❌ **Incorrecto:**
```css
.mi-componente {
  background-color: #000000;
  color: #ffffff;
}
```

✅ **Correcto:**
```css
.mi-componente {
  background-color: var(--fitzone-bg-primary);
  color: var(--fitzone-text-primary);
}
```

### 2. Usa Clases de Utilidad cuando sea Posible
❌ **Incorrecto:**
```html
<div style="background-color: black; color: white;">
  Contenido
</div>
```

✅ **Correcto:**
```html
<div class="bg-theme-primary text-theme-primary">
  Contenido
</div>
```

### 3. Evita Colores Fijos en Gradientes
❌ **Incorrecto:**
```css
.gradient {
  background: linear-gradient(to right, #000000, #333333);
}
```

✅ **Correcto:**
```css
.gradient {
  background: linear-gradient(
    to right,
    var(--fitzone-bg-primary),
    var(--fitzone-bg-tertiary)
  );
}
```

### 4. Testea en Ambos Temas
Siempre verifica que tus componentes se vean bien en:
- ☀️ Tema claro (light-theme)
- 🌙 Tema oscuro (dark-theme)

### 5. Mantén el Contraste Accesible
- Texto principal debe tener ratio 7:1 mínimo
- Texto secundario debe tener ratio 4.5:1 mínimo
- Los colores del sistema ya cumplen con WCAG AA

## 🔄 Cómo Cambiar el Tema

### En Código
```javascript
// Cambiar a tema oscuro
document.documentElement.classList.remove('light-theme')
document.documentElement.classList.add('dark-theme')

// Cambiar a tema claro
document.documentElement.classList.remove('dark-theme')
document.documentElement.classList.add('light-theme')
```

### Usando el Theme Context
```tsx
import { useTheme } from '@/contexts/theme-context'

function MiComponente() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      Cambiar a {theme === 'dark' ? 'claro' : 'oscuro'}
    </button>
  )
}
```

## 🎯 Ejemplos Prácticos

### Card de Membresía
```html
<div class="card-theme p-6 rounded-lg shadow-lg">
  <h3 class="text-theme-primary text-2xl font-bold mb-4">
    Plan Premium
  </h3>
  <p class="text-theme-secondary mb-6">
    Acceso completo a todas las instalaciones
  </p>
  <button class="btn-theme-primary px-6 py-3 rounded-lg">
    Seleccionar Plan
  </button>
</div>
```

### Formulario de Login
```html
<form class="bg-theme-secondary p-8 rounded-xl">
  <h2 class="text-theme-primary text-3xl font-bold mb-6">
    Iniciar Sesión
  </h2>
  
  <input 
    type="email"
    class="input-theme w-full p-3 rounded-lg mb-4"
    placeholder="Email"
  />
  
  <input 
    type="password"
    class="input-theme w-full p-3 rounded-lg mb-6"
    placeholder="Contraseña"
  />
  
  <button class="btn-theme-primary w-full py-3 rounded-lg">
    Entrar
  </button>
</form>
```

### Notificación de Éxito
```html
<div class="bg-theme-secondary border-theme border-l-4 border-l-success p-4 rounded">
  <span class="success-theme font-semibold">✓ Éxito</span>
  <p class="text-theme-secondary mt-1">
    Tu membresía ha sido activada correctamente
  </p>
</div>
```

## 🐛 Troubleshooting

### Problema: Los colores no cambian
**Solución:** Verifica que el elemento HTML tenga la clase del tema:
```html
<html class="dark-theme"> <!-- o "light-theme" -->
```

### Problema: Bajo contraste en modo claro
**Solución:** Usa `text-theme-primary` en lugar de colores fijos:
```html
<!-- Antes -->
<p class="text-gray-300">Texto</p>

<!-- Después -->
<p class="text-theme-secondary">Texto</p>
```

### Problema: Bordes invisibles
**Solución:** Usa las clases de borde temático:
```html
<!-- Antes -->
<div class="border border-gray-800">

<!-- Después -->
<div class="border border-theme">
```

## 📞 Soporte
Para preguntas o problemas con el sistema de temas, contacta al equipo de desarrollo frontend.

---
**Última actualización:** Octubre 2025  
**Versión:** 2.0
