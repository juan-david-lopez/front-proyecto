# 🔧 FIX: Transaction Rollback en Activación de Membresía

**Error:** `Transaction silently rolled back because it has been marked as rollback-only`  
**Endpoint:** `POST /api/v1/payments/{paymentIntentId}/activate-membership`  
**Fecha:** 11 de noviembre de 2025

---

## 🔍 Diagnóstico

### Error Completo:
```
Error al activar membresía: Transaction silently rolled back because it has been marked as rollback-only
```

### Causa Raíz:
Este error ocurre cuando:
1. Un método `@Transactional` llama a otro método `@Transactional`
2. El método interno lanza una excepción (checked o unchecked)
3. La excepción se captura en el método externo
4. Spring marca la transacción completa para rollback
5. Al intentar hacer commit, falla porque ya está marcada para rollback

---

## ❌ Código Problemático

```java
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/{paymentIntentId}/activate-membership")
    public ResponseEntity<?> activateMembership(
        @PathVariable String paymentIntentId,
        @RequestParam Long userId,
        @RequestParam String membershipType
    ) {
        try {
            MembershipResponse response = paymentService.activateMembership(
                paymentIntentId, 
                userId, 
                membershipType
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}

@Service
public class PaymentService {
    
    @Autowired
    private MembershipService membershipService;
    
    @Autowired
    private StripeService stripeService;
    
    // ❌ PROBLEMA AQUÍ
    @Transactional
    public MembershipResponse activateMembership(
        String paymentIntentId, 
        Long userId, 
        String membershipType
    ) {
        try {
            // 1. Verificar pago en Stripe
            PaymentIntent paymentIntent = stripeService.getPaymentIntent(paymentIntentId);
            
            if (!"succeeded".equals(paymentIntent.getStatus())) {
                throw new PaymentNotCompletedException("Pago no completado");
            }
            
            // 2. Crear membresía (otro método @Transactional)
            Membership membership = membershipService.createMembership(
                userId, 
                membershipType
            ); // ❌ Si esto falla, marca la transacción para rollback
            
            // 3. Registrar transacción
            registerTransaction(paymentIntentId, membership.getId());
            
            return new MembershipResponse(true, "Membresía activada", membership);
            
        } catch (Exception e) {
            // ❌ PROBLEMA: Captura la excepción pero la transacción ya está rollback
            log.error("Error activando membresía", e);
            throw new RuntimeException("Error al activar membresía: " + e.getMessage());
            // Cuando intenta hacer commit, falla porque la transacción está marcada rollback-only
        }
    }
}

@Service
public class MembershipService {
    
    @Autowired
    private MembershipRepository membershipRepository;
    
    @Transactional
    public Membership createMembership(Long userId, String membershipType) {
        // Si hay cualquier error aquí, marca TODA la transacción padre para rollback
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        
        MembershipType type = membershipTypeRepository.findByName(membershipType)
            .orElseThrow(() -> new MembershipTypeNotFoundException("Tipo de membresía no encontrado"));
        
        Membership membership = new Membership();
        membership.setUser(user);
        membership.setMembershipType(type);
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusMonths(1));
        membership.setStatus("ACTIVE");
        
        return membershipRepository.save(membership);
    }
}
```

---

## ✅ Solución 1: Usar Propagación REQUIRES_NEW

```java
@Service
public class MembershipService {
    
    // ✅ Crear una transacción NUEVA e INDEPENDIENTE
    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
    public Membership createMembership(Long userId, String membershipType) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        
        MembershipType type = membershipTypeRepository.findByName(membershipType)
            .orElseThrow(() -> new MembershipTypeNotFoundException("Tipo de membresía no encontrado"));
        
        Membership membership = new Membership();
        membership.setUser(user);
        membership.setMembershipType(type);
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusMonths(1));
        membership.setStatus("ACTIVE");
        
        return membershipRepository.save(membership);
    }
}
```

**Ventaja:** Cada transacción es independiente  
**Desventaja:** Si falla el método padre después, la membresía quedará creada

---

## ✅ Solución 2: No Capturar Excepciones (RECOMENDADO)

```java
@Service
public class PaymentService {
    
    @Autowired
    private MembershipService membershipService;
    
    @Autowired
    private StripeService stripeService;
    
    // ✅ Dejar que Spring maneje las excepciones
    @Transactional(rollbackFor = Exception.class)
    public MembershipResponse activateMembership(
        String paymentIntentId, 
        Long userId, 
        String membershipType
    ) throws PaymentException, MembershipException {
        
        // 1. Verificar pago en Stripe
        PaymentIntent paymentIntent = stripeService.getPaymentIntent(paymentIntentId);
        
        if (!"succeeded".equals(paymentIntent.getStatus())) {
            throw new PaymentNotCompletedException("Pago no completado");
        }
        
        // 2. Crear membresía (sin try-catch interno)
        Membership membership = membershipService.createMembership(userId, membershipType);
        
        // 3. Registrar transacción
        Transaction transaction = registerTransaction(paymentIntentId, membership.getId());
        
        // 4. Retornar respuesta exitosa
        return MembershipResponse.builder()
            .success(true)
            .message("Membresía activada exitosamente")
            .data(MembershipData.builder()
                .membershipId(membership.getId())
                .transactionId(transaction.getId().toString())
                .membershipType(membershipType)
                .startDate(membership.getStartDate().toString())
                .endDate(membership.getEndDate().toString())
                .build())
            .build();
    }
}

// Manejar excepciones en el Controller
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/{paymentIntentId}/activate-membership")
    public ResponseEntity<?> activateMembership(
        @PathVariable String paymentIntentId,
        @RequestParam Long userId,
        @RequestParam String membershipType
    ) {
        try {
            MembershipResponse response = paymentService.activateMembership(
                paymentIntentId, 
                userId, 
                membershipType
            );
            return ResponseEntity.ok(response);
            
        } catch (PaymentNotCompletedException e) {
            log.error("Pago no completado: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "success", false,
                    "error", "El pago no ha sido completado",
                    "details", e.getMessage()
                ));
                
        } catch (UserNotFoundException e) {
            log.error("Usuario no encontrado: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "error", "Usuario no encontrado",
                    "details", e.getMessage()
                ));
                
        } catch (MembershipTypeNotFoundException e) {
            log.error("Tipo de membresía no encontrado: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "error", "Tipo de membresía no encontrado",
                    "details", e.getMessage()
                ));
                
        } catch (Exception e) {
            log.error("Error inesperado activando membresía", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Error interno del servidor",
                    "details", e.getMessage()
                ));
        }
    }
}
```

**Ventaja:** Transacción atómica, si algo falla TODO se revierte  
**Recomendación:** ✅ **ESTA ES LA MEJOR SOLUCIÓN**

---

## ✅ Solución 3: Usar noRollbackFor para excepciones específicas

```java
@Service
public class PaymentService {
    
    // ✅ No hacer rollback para ciertas excepciones
    @Transactional(
        rollbackFor = {PaymentException.class, MembershipException.class},
        noRollbackFor = {ValidationException.class}
    )
    public MembershipResponse activateMembership(
        String paymentIntentId, 
        Long userId, 
        String membershipType
    ) {
        // Implementación...
    }
}
```

---

## 🎯 Solución RECOMENDADA: Código Completo

### 1. PaymentService.java

```java
package com.fitzone.service;

import com.fitzone.dto.MembershipResponse;
import com.fitzone.dto.MembershipData;
import com.fitzone.exception.*;
import com.fitzone.model.*;
import com.fitzone.repository.*;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final MembershipService membershipService;
    private final StripeService stripeService;
    private final TransactionRepository transactionRepository;
    
    /**
     * Activa una membresía después de confirmar un pago exitoso
     * 
     * @throws PaymentNotCompletedException si el pago no está completado
     * @throws UserNotFoundException si el usuario no existe
     * @throws MembershipTypeNotFoundException si el tipo de membresía no existe
     */
    @Transactional(rollbackFor = Exception.class)
    public MembershipResponse activateMembership(
        String paymentIntentId, 
        Long userId, 
        String membershipType
    ) throws PaymentException, MembershipException {
        
        log.info("🔄 Iniciando activación de membresía - PaymentIntent: {}, UserId: {}, Type: {}", 
            paymentIntentId, userId, membershipType);
        
        // 1. Verificar que el pago esté completado en Stripe
        PaymentIntent paymentIntent = stripeService.getPaymentIntent(paymentIntentId);
        
        if (!"succeeded".equals(paymentIntent.getStatus())) {
            log.error("❌ Pago no completado - Status: {}", paymentIntent.getStatus());
            throw new PaymentNotCompletedException(
                "El pago no ha sido completado. Estado actual: " + paymentIntent.getStatus()
            );
        }
        
        log.info("✅ Pago verificado exitosamente - Amount: {}", paymentIntent.getAmount());
        
        // 2. Crear la membresía
        Membership membership = membershipService.createMembership(userId, membershipType);
        log.info("✅ Membresía creada - ID: {}", membership.getId());
        
        // 3. Registrar la transacción
        Transaction transaction = registerTransaction(paymentIntentId, membership);
        log.info("✅ Transacción registrada - ID: {}", transaction.getId());
        
        // 4. Construir respuesta
        MembershipResponse response = MembershipResponse.builder()
            .success(true)
            .message("Membresía activada exitosamente")
            .data(MembershipData.builder()
                .membershipId(membership.getId())
                .transactionId(transaction.getId().toString())
                .membershipType(membershipType)
                .startDate(membership.getStartDate().toString())
                .endDate(membership.getEndDate().toString())
                .build())
            .build();
        
        log.info("🎉 Membresía activada exitosamente - UserId: {}, MembershipId: {}", 
            userId, membership.getId());
        
        return response;
    }
    
    /**
     * Registra la transacción del pago
     */
    private Transaction registerTransaction(String paymentIntentId, Membership membership) {
        Transaction transaction = new Transaction();
        transaction.setId(UUID.randomUUID());
        transaction.setPaymentIntentId(paymentIntentId);
        transaction.setMembershipId(membership.getId());
        transaction.setUserId(membership.getUser().getId());
        transaction.setAmount(membership.getMembershipType().getPrice());
        transaction.setStatus("COMPLETED");
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setPaymentMethod("STRIPE");
        
        return transactionRepository.save(transaction);
    }
}
```

### 2. MembershipService.java

```java
package com.fitzone.service;

import com.fitzone.exception.MembershipTypeNotFoundException;
import com.fitzone.exception.UserNotFoundException;
import com.fitzone.model.*;
import com.fitzone.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class MembershipService {
    
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final MembershipTypeRepository membershipTypeRepository;
    
    /**
     * Crea una nueva membresía para el usuario
     * Usa la misma transacción del método padre
     */
    @Transactional(rollbackFor = Exception.class)
    public Membership createMembership(Long userId, String membershipTypeName) {
        
        log.info("🔄 Creando membresía - UserId: {}, Type: {}", userId, membershipTypeName);
        
        // 1. Buscar usuario
        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                log.error("❌ Usuario no encontrado - ID: {}", userId);
                return new UserNotFoundException("Usuario no encontrado con ID: " + userId);
            });
        
        // 2. Buscar tipo de membresía (normalizar nombre)
        String normalizedName = membershipTypeName.toUpperCase();
        MembershipType membershipType = membershipTypeRepository
            .findByName(normalizedName)
            .or(() -> membershipTypeRepository.findByName(membershipTypeName))
            .orElseThrow(() -> {
                log.error("❌ Tipo de membresía no encontrado - Name: {}", membershipTypeName);
                return new MembershipTypeNotFoundException(
                    "Tipo de membresía no encontrado: " + membershipTypeName
                );
            });
        
        // 3. Desactivar membresía anterior si existe
        membershipRepository.findActiveByUserId(userId)
            .ifPresent(oldMembership -> {
                log.info("🔄 Desactivando membresía anterior - ID: {}", oldMembership.getId());
                oldMembership.setStatus("INACTIVE");
                membershipRepository.save(oldMembership);
            });
        
        // 4. Crear nueva membresía
        Membership membership = new Membership();
        membership.setUser(user);
        membership.setMembershipType(membershipType);
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusMonths(1));
        membership.setStatus("ACTIVE");
        membership.setAutoRenewalEnabled(false);
        membership.setCreatedAt(LocalDateTime.now());
        
        Membership savedMembership = membershipRepository.save(membership);
        log.info("✅ Membresía creada exitosamente - ID: {}", savedMembership.getId());
        
        return savedMembership;
    }
}
```

### 3. PaymentController.java

```java
package com.fitzone.controller;

import com.fitzone.dto.MembershipResponse;
import com.fitzone.exception.*;
import com.fitzone.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping("/{paymentIntentId}/activate-membership")
    public ResponseEntity<?> activateMembership(
        @PathVariable String paymentIntentId,
        @RequestParam Long userId,
        @RequestParam String membershipType
    ) {
        try {
            log.info("📥 Solicitud de activación - PaymentIntent: {}, UserId: {}, Type: {}", 
                paymentIntentId, userId, membershipType);
            
            MembershipResponse response = paymentService.activateMembership(
                paymentIntentId, 
                userId, 
                membershipType
            );
            
            return ResponseEntity.ok(response);
            
        } catch (PaymentNotCompletedException e) {
            log.error("❌ Pago no completado: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "success", false,
                    "error", "El pago no ha sido completado",
                    "message", e.getMessage()
                ));
                
        } catch (UserNotFoundException e) {
            log.error("❌ Usuario no encontrado: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "error", "Usuario no encontrado",
                    "message", e.getMessage()
                ));
                
        } catch (MembershipTypeNotFoundException e) {
            log.error("❌ Tipo de membresía no encontrado: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "error", "Tipo de membresía no válido",
                    "message", e.getMessage()
                ));
                
        } catch (Exception e) {
            log.error("❌ Error inesperado activando membresía", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Error interno del servidor",
                    "message", "Por favor contacte al soporte técnico"
                ));
        }
    }
}
```

### 4. Excepciones Personalizadas

```java
package com.fitzone.exception;

public class PaymentException extends Exception {
    public PaymentException(String message) {
        super(message);
    }
}

public class PaymentNotCompletedException extends PaymentException {
    public PaymentNotCompletedException(String message) {
        super(message);
    }
}

public class MembershipException extends Exception {
    public MembershipException(String message) {
        super(message);
    }
}

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}

public class MembershipTypeNotFoundException extends RuntimeException {
    public MembershipTypeNotFoundException(String message) {
        super(message);
    }
}
```

---

## 🎯 Checklist de Implementación

### Backend:
- [ ] Eliminar try-catch dentro de métodos `@Transactional`
- [ ] Mover manejo de excepciones al Controller
- [ ] Agregar `@Transactional(rollbackFor = Exception.class)` en métodos críticos
- [ ] Crear excepciones personalizadas para cada caso de error
- [ ] Agregar logs detallados en cada paso
- [ ] Validar que `MembershipType` se busque con nombre normalizado (BASICO/basico)
- [ ] Desactivar membresías anteriores antes de crear una nueva
- [ ] Retornar respuestas consistentes con el formato esperado por el frontend

### Testing:
- [ ] Probar con pago exitoso
- [ ] Probar con usuario inexistente
- [ ] Probar con tipo de membresía inválido
- [ ] Probar con pago no completado
- [ ] Probar con error de base de datos
- [ ] Verificar que las transacciones se revierten correctamente en caso de error

---

## 📊 Formato de Respuesta Esperado

### ✅ Éxito:
```json
{
  "success": true,
  "message": "Membresía activada exitosamente",
  "data": {
    "membershipId": 123,
    "transactionId": "550e8400-e29b-41d4-a716-446655440000",
    "membershipType": "PREMIUM",
    "startDate": "2025-11-11",
    "endDate": "2025-12-11"
  }
}
```

### ❌ Error:
```json
{
  "success": false,
  "error": "Usuario no encontrado",
  "message": "Usuario no encontrado con ID: 999"
}
```

---

## 🚀 Próximos Pasos

1. **Implementar el código corregido** en el backend
2. **Ejecutar tests** para validar todos los casos
3. **Desplegar en desarrollo** y probar con el frontend
4. **Monitorear logs** para verificar que no hay más rollbacks silenciosos
5. **Documentar** el proceso en la wiki del equipo

---

**Elaborado por:** Equipo de Desarrollo FitZone  
**Fecha:** 11 de noviembre de 2025  
**Prioridad:** 🔥 **CRÍTICA**
