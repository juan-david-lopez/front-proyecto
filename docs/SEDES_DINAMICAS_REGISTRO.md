# ✅ Sedes Dinámicas en Formulario de Registro

## 📅 Fecha
**8 de octubre de 2025**

---

## 🎯 Objetivo

Cargar las **sedes dinámicamente desde el backend** en lugar de tenerlas hardcodeadas, permitiendo que el sistema sea escalable y que el número de sede (`mainLocationId`) se asigne automáticamente según lo que retorne el backend.

---

## 🔄 Cambio Implementado

### Antes ❌

**Sedes Hardcodeadas:**
```typescript
const locationMap: { [key: string]: number } = {
  "norte": 1,
  "sur": 2,
  "centro": 3,
  "oriente": 4
}

<SelectItem value="norte">Sede Norte</SelectItem>
<SelectItem value="sur">Sede Sur</SelectItem>
<SelectItem value="centro">Sede Centro</SelectItem>
<SelectItem value="oriente">Sede Oriente</SelectItem>
```

**Problemas:**
- ❌ IDs hardcodeados
- ❌ No escalable (agregar sede = modificar código)
- ❌ Nombres fijos (no multilenguaje)
- ❌ No refleja datos reales del backend

---

### Ahora ✅

**Sedes Dinámicas:**
```typescript
// 1. Cargar sedes del backend
const [locations, setLocations] = useState<Location[]>([])

useEffect(() => {
  async function loadLocations() {
    const fetchedLocations = await locationService.getAllLocations()
    setLocations(fetchedLocations)
  }
  loadLocations()
}, [])

// 2. Renderizar dinámicamente
{locations.map((location) => (
  <SelectItem key={location.id} value={location.id.toString()}>
    {location.name} - {location.city}
  </SelectItem>
))}

// 3. Enviar ID directamente
mainLocationId: Number(formData.mainLocationId)
```

**Beneficios:**
- ✅ IDs del backend
- ✅ Escalable (nuevas sedes automáticas)
- ✅ Nombres actualizables
- ✅ Refleja datos reales

---

## 📁 Archivos Creados/Modificados

### 1. **services/locationService.ts** (NUEVO)

Servicio para manejar operaciones con sedes.

#### Métodos Principales:

```typescript
/**
 * Obtener todas las sedes disponibles
 */
async getAllLocations(): Promise<Location[]>

/**
 * Obtener una sede específica por ID
 */
async getLocationById(locationId: number): Promise<Location | null>

/**
 * Sedes por defecto (fallback si backend no disponible)
 */
private getDefaultLocations(): Location[]
```

#### Endpoint del Backend:

```
GET /api/v1/locations
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sede Norte",
      "address": "Calle 123 #45-67",
      "city": "Bogotá",
      "phone": "+57 300 123 4567",
      "amenities": ["Pesas", "Cardio", "Clases Grupales"],
      "operatingHours": {
        "Lunes": { "open": "06:00", "close": "22:00" }
      }
    },
    {
      "id": 2,
      "name": "Sede Sur",
      "address": "Carrera 98 #76-54",
      "city": "Medellín",
      "phone": "+57 300 234 5678",
      "amenities": ["Pesas", "Cardio", "Piscina"],
      "operatingHours": {
        "Lunes": { "open": "06:00", "close": "22:00" }
      }
    }
  ]
}
```

#### Fallback (Sedes por Defecto):

Si el backend no está disponible, el servicio retorna **4 sedes por defecto**:
- Sede Norte (id: 1)
- Sede Sur (id: 2)
- Sede Centro (id: 3)
- Sede Oriente (id: 4)

---

### 2. **app/register/page.tsx** (MODIFICADO)

#### Imports Agregados:

```typescript
import { useState, useEffect } from "react"
import { locationService } from "@/services/locationService"
import { Location } from "@/types/reservation"
```

#### Estado Agregado:

```typescript
const [locations, setLocations] = useState<Location[]>([])
const [loadingLocations, setLoadingLocations] = useState(true)
```

#### useEffect para Cargar Sedes:

```typescript
useEffect(() => {
  async function loadLocations() {
    try {
      setLoadingLocations(true)
      const fetchedLocations = await locationService.getAllLocations()
      setLocations(fetchedLocations)
      console.log('✅ Sedes cargadas:', fetchedLocations)
    } catch (error) {
      console.error('❌ Error cargando sedes:', error)
    } finally {
      setLoadingLocations(false)
    }
  }
  
  loadLocations()
}, [])
```

#### Select Actualizado:

```tsx
<Select 
  value={formData.mainLocationId} 
  onValueChange={handleSelectChange("mainLocationId")}
  required
  disabled={loadingLocations}
>
  <SelectTrigger>
    <SelectValue placeholder={
      loadingLocations 
        ? "Cargando sedes..." 
        : "Selecciona tu sede preferida"
    } />
  </SelectTrigger>
  <SelectContent>
    {loadingLocations ? (
      <SelectItem value="loading" disabled>
        Cargando sedes...
      </SelectItem>
    ) : locations.length > 0 ? (
      locations.map((location) => (
        <SelectItem 
          key={location.id} 
          value={location.id.toString()}
        >
          {location.name} - {location.city}
        </SelectItem>
      ))
    ) : (
      <SelectItem value="no-locations" disabled>
        No hay sedes disponibles
      </SelectItem>
    )}
  </SelectContent>
</Select>
```

#### Envío de Datos:

**Antes:**
```typescript
mainLocationId: locationMap[formData.mainLocationId]
```

**Ahora:**
```typescript
mainLocationId: Number(formData.mainLocationId)
```

**Explicación:**
- `formData.mainLocationId` ahora contiene directamente el **ID de la sede** (ej: "1", "2", "3")
- Se convierte a número con `Number()` antes de enviar al backend

---

## 🎨 Experiencia del Usuario

### Escenario 1: Sedes Cargadas Correctamente

```
┌─────────────────────────────────────┐
│  Sede Principal *                   │
├─────────────────────────────────────┤
│  [Selecciona tu sede preferida ▼]   │ ← Click
├─────────────────────────────────────┤
│  ✅ Sede Norte - Bogotá             │
│  ✅ Sede Sur - Medellín             │
│  ✅ Sede Centro - Cali              │
│  ✅ Sede Oriente - Barranquilla     │
└─────────────────────────────────────┘
```

### Escenario 2: Cargando Sedes

```
┌─────────────────────────────────────┐
│  Sede Principal *                   │
├─────────────────────────────────────┤
│  [Cargando sedes...] 🔄             │ ← Deshabilitado
└─────────────────────────────────────┘
```

### Escenario 3: Sin Sedes Disponibles

```
┌─────────────────────────────────────┐
│  Sede Principal *                   │
├─────────────────────────────────────┤
│  [No hay sedes disponibles]         │ ← Deshabilitado
└─────────────────────────────────────┘
```

---

## 🔄 Flujo Completo

```
1. Usuario abre formulario de registro
   ↓
2. useEffect se ejecuta automáticamente
   ↓
3. locationService.getAllLocations()
   ├─ Backend disponible → GET /api/v1/locations
   │   ↓
   │   Retorna sedes reales
   │
   └─ Backend no disponible → Sedes por defecto
       ↓
       Retorna 4 sedes hardcodeadas
   ↓
4. setLocations(fetchedLocations)
   ↓
5. Select renderiza opciones dinámicamente
   ↓
6. Usuario selecciona "Sede Norte - Bogotá"
   ↓
7. formData.mainLocationId = "1"
   ↓
8. Envío: mainLocationId: Number("1") = 1
   ↓
9. Backend recibe: { mainLocationId: 1 }
```

---

## 📊 Comparación

| Aspecto | Antes (Hardcoded) | Ahora (Dinámico) |
|---------|-------------------|------------------|
| **Fuente de datos** | Código frontend | Backend API |
| **Escalabilidad** | Manual (editar código) | Automática (backend) |
| **IDs** | Inventados ("norte") | Reales del backend (1, 2, 3) |
| **Nombres** | Fijos | Actualizables |
| **Ciudades** | No disponibles | Mostradas |
| **Fallback** | N/A | Sedes por defecto |
| **Mantenimiento** | Alto | Bajo |

---

## 🧪 Casos de Prueba

### ✅ Caso 1: Backend Disponible

**Request:**
```
GET /api/v1/locations
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 5, "name": "Sede Nueva", "city": "Cartagena" }
  ]
}
```

**Resultado:**
- ✅ Select muestra "Sede Nueva - Cartagena"
- ✅ Usuario selecciona → `mainLocationId: 5`

---

### ✅ Caso 2: Backend No Disponible

**Request:**
```
GET /api/v1/locations → ERROR 500
```

**Fallback:**
```typescript
return this.getDefaultLocations() // 4 sedes
```

**Resultado:**
- ✅ Select muestra 4 sedes por defecto
- ✅ Usuario puede continuar registrándose

---

### ✅ Caso 3: Backend Retorna Array Vacío

**Response:**
```json
{
  "success": true,
  "data": []
}
```

**Resultado:**
- ⚠️ Select muestra "No hay sedes disponibles"
- ❌ Usuario no puede continuar sin sede

---

## 🚀 Futuras Mejoras

### 1. Caché de Sedes

```typescript
// Guardar en localStorage
const cachedLocations = localStorage.getItem('locations')
if (cachedLocations) {
  setLocations(JSON.parse(cachedLocations))
} else {
  const fetched = await locationService.getAllLocations()
  localStorage.setItem('locations', JSON.stringify(fetched))
}
```

### 2. Filtrar por Ciudad

```tsx
<Input 
  placeholder="Buscar por ciudad..." 
  onChange={(e) => setFilter(e.target.value)}
/>

{locations
  .filter(loc => loc.city.includes(filter))
  .map(location => (...))}
```

### 3. Mostrar Más Información

```tsx
<SelectItem value={location.id.toString()}>
  <div>
    <div className="font-bold">{location.name}</div>
    <div className="text-xs text-gray-500">
      {location.address} - {location.city}
    </div>
    <div className="text-xs text-gray-400">
      {location.amenities.join(', ')}
    </div>
  </div>
</SelectItem>
```

---

## ✅ Validación de Datos

### Frontend

```typescript
if (!formData.mainLocationId) {
  newErrors.mainLocationId = "Debes seleccionar tu sede principal"
}

// mainLocationId es string en el form, se convierte a number en envío
mainLocationId: Number(formData.mainLocationId) // 1, 2, 3, etc.
```

### Backend (Esperado)

```java
@NotNull(message = "La sede principal es obligatoria")
@Min(value = 1, message = "ID de sede inválido")
private Long mainLocationId;
```

---

## 📝 Resumen

### Lo que cambió:

1. ✅ **Nuevo servicio:** `locationService.ts`
2. ✅ **Endpoint llamado:** `GET /api/v1/locations`
3. ✅ **Select dinámico:** Renderiza opciones desde backend
4. ✅ **Fallback:** Sedes por defecto si backend falla
5. ✅ **IDs reales:** Ya no se usan strings inventados
6. ✅ **Estados de carga:** "Cargando sedes..." mientras espera

### Payload Final:

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "Password123!",
  "documentType": "CC",
  "documentNumber": "1234567890",
  "phoneNumber": "+57 300 123 4567",
  "birthDate": "1990-01-01",
  "emergencyContactPhone": "+57 300 999 8888",
  "mainLocationId": 1,  // ✅ ID real del backend
  "role": "MEMBER"
}
```

---

**Implementado por:** GitHub Copilot AI Assistant  
**Fecha:** 8 de octubre de 2025  
**Versión:** 3.0.0
