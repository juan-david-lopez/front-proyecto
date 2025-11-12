# 🔧 FIX: Botón "Gestionar Membresía" No Funciona

**Problema:** El botón "Gestionar Membresía" en el dashboard no muestra información  
**Endpoint Faltante:** `GET /memberships/details/{userId}`  
**Fecha:** 11 de noviembre de 2025

---

## 🔍 Diagnóstico

### Problema Reportado:
```
"El botón de gestionar membresía no sirve"
```

### Causa Raíz:
El frontend intenta llamar al endpoint `GET /memberships/details/{userId}` que **NO está implementado** en el backend. Este es uno de los **6 endpoints críticos faltantes** según `BACKEND_FALTANTES_ANALISIS.md`.

### Flujo Actual:
1. Usuario hace clic en "Gestionar Membresía" en `/dashboard`
2. Se redirige a `/dashboard/membresia`
3. La página llama a `membershipManagementService.getMembershipDetails(userId)`
4. El servicio intenta llamar a `GET /memberships/details/{userId}` ❌ **No existe**
5. Como fallback, intenta `GET /memberships/user/{userId}` ⚠️ **Puede existir**
6. Si falla, muestra "No tienes membresía activa"

---

## ✅ Solución Temporal Implementada (Frontend)

He modificado `services/membershipManagementService.ts` para usar un **sistema de fallback** con 3 intentos:

### Intento 1: Endpoint Ideal (no disponible aún)
```typescript
GET /memberships/details/{userId}
```

### Intento 2: Endpoint Básico (puede existir)
```typescript
GET /memberships/user/{userId}
```

### Intento 3: Respuesta por Defecto
```typescript
{
  hasMembership: false,
  userId: userId,
  message: 'No se pudo obtener información de membresía'
}
```

---

## 🛠️ Solución Permanente (Backend)

El backend **DEBE implementar** este endpoint crítico:

### **Endpoint Requerido:**

```http
GET /memberships/details/{userId}
Authorization: Bearer {token}

Response (200) - Usuario CON membresía:
{
  "hasMembership": true,
  "userId": 123,
  "membershipId": 456,
  "status": "ACTIVE",
  "membershipType": "PREMIUM",
  "startDate": "2025-10-07",
  "endDate": "2025-11-07",
  "daysRemaining": 3,
  "canSuspend": true,
  "canCancel": true,
  "suspensionsUsed": 1,
  "maxSuspensions": 2,
  "autoRenewalEnabled": true,
  "location": {
    "id": 1,
    "name": "Sede Norte"
  }
}

Response (200) - Usuario SIN membresía:
{
  "hasMembership": false,
  "userId": 123,
  "message": "No tienes una membresía activa",
  "needsLocation": false
}

Response (200) - Usuario necesita asignar ubicación:
{
  "hasMembership": false,
  "userId": 123,
  "message": "Debes asignar una ubicación principal",
  "needsLocation": true
}
```

---

## 📋 Implementación en Backend

### 1. Crear DTO (Data Transfer Object)

```java
package com.fitzone.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MembershipDetailsResponse {
    private boolean hasMembership;
    private Long userId;
    private Long membershipId;
    private String status;
    private String membershipType;
    private String startDate;
    private String endDate;
    private Integer daysRemaining;
    private Boolean canSuspend;
    private Boolean canCancel;
    private Integer suspensionsUsed;
    private Integer maxSuspensions;
    private Boolean autoRenewalEnabled;
    private LocationInfo location;
    private String message;
    private Boolean needsLocation;
    
    @Data
    @Builder
    public static class LocationInfo {
        private Long id;
        private String name;
    }
}
```

### 2. Agregar Método en MembershipService

```java
package com.fitzone.service;

import com.fitzone.dto.MembershipDetailsResponse;
import com.fitzone.exception.UserNotFoundException;
import com.fitzone.model.*;
import com.fitzone.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MembershipService {
    
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    
    /**
     * Obtiene los detalles completos de la membresía de un usuario
     * Incluye información sobre si puede suspender, cancelar, etc.
     */
    @Transactional(readOnly = true)
    public MembershipDetailsResponse getMembershipDetails(Long userId) {
        log.info("📡 Getting membership details for user {}", userId);
        
        // 1. Verificar que el usuario exista
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userId));
        
        // 2. Verificar si el usuario necesita asignar ubicación
        if (user.getLocation() == null) {
            log.warn("⚠️ Usuario {} no tiene ubicación asignada", userId);
            return MembershipDetailsResponse.builder()
                .hasMembership(false)
                .userId(userId)
                .message("Debes asignar una ubicación principal antes de adquirir una membresía")
                .needsLocation(true)
                .build();
        }
        
        // 3. Buscar membresía activa
        Optional<Membership> membershipOpt = membershipRepository.findActiveByUserId(userId);
        
        if (membershipOpt.isEmpty()) {
            log.info("ℹ️ Usuario {} no tiene membresía activa", userId);
            return MembershipDetailsResponse.builder()
                .hasMembership(false)
                .userId(userId)
                .message("No tienes una membresía activa")
                .needsLocation(false)
                .build();
        }
        
        // 4. Usuario tiene membresía - construir respuesta completa
        Membership membership = membershipOpt.get();
        
        // Calcular días restantes
        int daysRemaining = calculateDaysRemaining(membership.getEndDate());
        
        // Verificar si puede suspender (máximo 2 suspensiones)
        int suspensionsUsed = membership.getSuspensionsUsed() != null 
            ? membership.getSuspensionsUsed() 
            : 0;
        boolean canSuspend = "ACTIVE".equals(membership.getStatus()) 
            && suspensionsUsed < 2;
        
        // Verificar si puede cancelar
        boolean canCancel = "ACTIVE".equals(membership.getStatus()) 
            || "SUSPENDED".equals(membership.getStatus());
        
        // Obtener información de ubicación
        MembershipDetailsResponse.LocationInfo locationInfo = null;
        if (user.getLocation() != null) {
            locationInfo = MembershipDetailsResponse.LocationInfo.builder()
                .id(user.getLocation().getId())
                .name(user.getLocation().getName())
                .build();
        }
        
        log.info("✅ Membresía encontrada para usuario {} - Status: {}, Type: {}", 
            userId, membership.getStatus(), membership.getMembershipType().getName());
        
        return MembershipDetailsResponse.builder()
            .hasMembership(true)
            .userId(userId)
            .membershipId(membership.getId())
            .status(membership.getStatus())
            .membershipType(membership.getMembershipType().getName())
            .startDate(membership.getStartDate().toString())
            .endDate(membership.getEndDate().toString())
            .daysRemaining(daysRemaining)
            .canSuspend(canSuspend)
            .canCancel(canCancel)
            .suspensionsUsed(suspensionsUsed)
            .maxSuspensions(2)
            .autoRenewalEnabled(membership.getAutoRenewalEnabled() != null 
                ? membership.getAutoRenewalEnabled() 
                : false)
            .location(locationInfo)
            .message("Membresía activa")
            .needsLocation(false)
            .build();
    }
    
    /**
     * Calcula los días restantes hasta la fecha de vencimiento
     */
    private int calculateDaysRemaining(LocalDate endDate) {
        if (endDate == null) {
            return 0;
        }
        
        LocalDate today = LocalDate.now();
        long days = ChronoUnit.DAYS.between(today, endDate);
        
        return Math.max(0, (int) days);
    }
}
```

### 3. Agregar Endpoint en MembershipController

```java
package com.fitzone.controller;

import com.fitzone.dto.MembershipDetailsResponse;
import com.fitzone.service.MembershipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/memberships")
@RequiredArgsConstructor
public class MembershipController {
    
    private final MembershipService membershipService;
    
    /**
     * Obtener detalles completos de la membresía de un usuario
     * 
     * @param userId ID del usuario
     * @return Detalles de la membresía o información de que no tiene membresía
     */
    @GetMapping("/details/{userId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'STAFF')")
    public ResponseEntity<MembershipDetailsResponse> getMembershipDetails(
        @PathVariable Long userId
    ) {
        log.info("📥 GET /memberships/details/{} - Obteniendo detalles de membresía", userId);
        
        try {
            MembershipDetailsResponse response = membershipService.getMembershipDetails(userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Error obteniendo detalles de membresía para usuario {}", userId, e);
            
            // En caso de error, retornar respuesta por defecto
            MembershipDetailsResponse errorResponse = MembershipDetailsResponse.builder()
                .hasMembership(false)
                .userId(userId)
                .message("Error al obtener información de membresía: " + e.getMessage())
                .needsLocation(false)
                .build();
            
            return ResponseEntity.ok(errorResponse);
        }
    }
}
```

### 4. Actualizar Entidad Membership (si no existe el campo)

```java
package com.fitzone.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "memberships")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membership {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_type_id", nullable = false)
    private MembershipType membershipType;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "status", nullable = false)
    private String status; // ACTIVE, SUSPENDED, EXPIRED, CANCELLED
    
    @Column(name = "auto_renewal_enabled")
    private Boolean autoRenewalEnabled;
    
    // ⭐ AGREGAR ESTE CAMPO SI NO EXISTE
    @Column(name = "suspensions_used")
    private Integer suspensionsUsed;
}
```

### 5. Agregar Método en MembershipRepository

```java
package com.fitzone.repository;

import com.fitzone.model.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
    /**
     * Buscar membresía activa por usuario
     */
    @Query("SELECT m FROM Membership m WHERE m.user.id = :userId AND m.status = 'ACTIVE'")
    Optional<Membership> findActiveByUserId(@Param("userId") Long userId);
}
```

---

## 🧪 Casos de Prueba

### Test 1: Usuario con Membresía Activa
```bash
curl -X GET "http://localhost:8080/memberships/details/123" \
  -H "Authorization: Bearer {token}"

# Esperado: HTTP 200
# {
#   "hasMembership": true,
#   "userId": 123,
#   "membershipId": 456,
#   "status": "ACTIVE",
#   ...
# }
```

### Test 2: Usuario sin Membresía
```bash
curl -X GET "http://localhost:8080/memberships/details/999" \
  -H "Authorization: Bearer {token}"

# Esperado: HTTP 200
# {
#   "hasMembership": false,
#   "userId": 999,
#   "message": "No tienes una membresía activa"
# }
```

### Test 3: Usuario sin Ubicación Asignada
```bash
curl -X GET "http://localhost:8080/memberships/details/777" \
  -H "Authorization: Bearer {token}"

# Esperado: HTTP 200
# {
#   "hasMembership": false,
#   "needsLocation": true,
#   "message": "Debes asignar una ubicación principal..."
# }
```

---

## 📊 Impacto

### Sin este endpoint:
- ❌ El botón "Gestionar Membresía" no funciona correctamente
- ❌ Usuarios no pueden ver detalles de su membresía
- ❌ No se puede determinar si pueden suspender/cancelar
- ❌ Mala experiencia de usuario

### Con este endpoint:
- ✅ Botón "Gestionar Membresía" funciona perfectamente
- ✅ Usuarios ven toda la información de su membresía
- ✅ Sistema sabe qué acciones están disponibles
- ✅ Experiencia de usuario completa

---

## 🎯 Prioridad

**🔥 CRÍTICA** - Este es uno de los 26 endpoints críticos faltantes

### Orden de Implementación Recomendado:
1. ✅ Crear DTO `MembershipDetailsResponse`
2. ✅ Agregar método `getMembershipDetails()` en `MembershipService`
3. ✅ Agregar endpoint `GET /memberships/details/{userId}` en `MembershipController`
4. ✅ Agregar campo `suspensionsUsed` en entidad `Membership` si no existe
5. ✅ Agregar método `findActiveByUserId()` en `MembershipRepository` si no existe
6. ✅ Probar con los 3 casos (con membresía, sin membresía, sin ubicación)

---

## 🔗 Endpoints Relacionados que También Faltan

Según `BACKEND_FALTANTES_ANALISIS.md`, además de este endpoint, también faltan:

```typescript
❌ POST   /memberships/renew          // Renovar membresía
❌ POST   /memberships/suspend        // Suspender membresía
❌ POST   /memberships/reactivate     // Reactivar membresía suspendida
❌ POST   /memberships/cancel         // Cancelar membresía
❌ GET    /memberships/history/{userId} // Historial de membresías
```

**Recomendación:** Implementar todos estos endpoints juntos para tener el módulo completo de gestión de membresías.

---

## 📚 Documentación de Referencia

- `docs/BACKEND_FALTANTES_ANALISIS.md` - Lista completa de endpoints faltantes
- `docs/BACKEND_IMPLEMENTATION_GUIDE.md` - Guía de implementación general
- `services/membershipManagementService.ts` - Servicio del frontend (ver qué espera recibir)
- `app/dashboard/membresia/page.tsx` - Página que consume el endpoint

---

**Elaborado por:** Equipo de Desarrollo FitZone  
**Fecha:** 11 de noviembre de 2025  
**Prioridad:** 🔥 **CRÍTICA**  
**Estimado de Implementación:** 2-3 horas
