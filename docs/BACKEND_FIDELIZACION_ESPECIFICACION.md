# 📋 Especificación Backend - Sistema de Fidelización FitZone

## 🎯 Objetivo

Implementar el **sistema completo de fidelización** (loyalty program) en el backend para soportar la funcionalidad ya desarrollada en el frontend.

---

## 📊 Modelo de Datos

### 1. **Tabla: `loyalty_profiles`**

Perfil de fidelización de cada usuario.

```sql
CREATE TABLE loyalty_profiles (
    id_loyalty_profile BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    current_tier ENUM('BRONCE', 'PLATA', 'ORO', 'PLATINO') DEFAULT 'BRONCE',
    total_points INT DEFAULT 0,
    available_points INT DEFAULT 0,
    member_since DATETIME NOT NULL,
    last_activity_date DATETIME,
    total_activities_logged INT DEFAULT 0,
    consecutive_login_days INT DEFAULT 0,
    total_referrals INT DEFAULT 0,
    classes_attended INT DEFAULT 0,
    renewals_completed INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_current_tier (current_tier)
);
```

**Notas:**
- `total_points`: Puntos acumulados históricamente (nunca disminuyen)
- `available_points`: Puntos disponibles para canjear (disminuyen al canjear)
- Crear automáticamente al registrar un nuevo usuario

---

### 2. **Tabla: `loyalty_activities`**

Registro de actividades que generan puntos.

```sql
CREATE TABLE loyalty_activities (
    id_loyalty_activity BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    activity_type ENUM(
        'MEMBERSHIP_PURCHASE',
        'MEMBERSHIP_RENEWAL', 
        'MEMBERSHIP_UPGRADE',
        'CLASS_ATTENDANCE',
        'REFERRAL',
        'LOGIN_STREAK',
        'EARLY_RENEWAL',
        'PAYMENT_ON_TIME',
        'SOCIAL_SHARE',
        'PROFILE_COMPLETION'
    ) NOT NULL,
    points_earned INT NOT NULL,
    description VARCHAR(255),
    activity_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date DATETIME,
    is_expired BOOLEAN DEFAULT FALSE,
    is_cancelled BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_activity_date (activity_date)
);
```

**Puntos sugeridos por actividad:**
- `MEMBERSHIP_PURCHASE`: 100 puntos
- `MEMBERSHIP_RENEWAL`: 50 puntos
- `MEMBERSHIP_UPGRADE`: 75 puntos
- `CLASS_ATTENDANCE`: 10 puntos
- `REFERRAL`: 200 puntos
- `LOGIN_STREAK` (7 días): 25 puntos
- `EARLY_RENEWAL` (15+ días antes): 40 puntos
- `PAYMENT_ON_TIME`: 20 puntos
- `SOCIAL_SHARE`: 15 puntos
- `PROFILE_COMPLETION`: 30 puntos

---

### 3. **Tabla: `loyalty_rewards`**

Catálogo de recompensas disponibles.

```sql
CREATE TABLE loyalty_rewards (
    id_loyalty_reward BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    reward_type ENUM(
        'FREE_CLASS',
        'RENEWAL_DISCOUNT',
        'TEMPORARY_UPGRADE',
        'PERSONAL_TRAINING',
        'GUEST_PASS',
        'MERCHANDISE_DISCOUNT',
        'NUTRITIONAL_CONSULTATION',
        'EXTENSION_DAYS'
    ) NOT NULL,
    points_cost INT NOT NULL,
    minimum_tier_required ENUM('BRONCE', 'PLATA', 'ORO', 'PLATINO') DEFAULT 'BRONCE',
    validity_days INT NOT NULL DEFAULT 30,
    reward_value VARCHAR(100),
    terms_and_conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_reward_type (reward_type),
    INDEX idx_is_active (is_active)
);
```

**Recompensas sugeridas:**

| Nombre | Tipo | Costo | Tier Mínimo | Validez | Valor |
|--------|------|-------|-------------|---------|-------|
| Clase Grupal Gratis | FREE_CLASS | 50 | BRONCE | 30 días | 1 clase |
| 10% Descuento Renovación | RENEWAL_DISCOUNT | 100 | BRONCE | 60 días | 10% |
| Upgrade Premium 1 Mes | TEMPORARY_UPGRADE | 300 | PLATA | 30 días | 1 mes |
| Sesión Personal Training | PERSONAL_TRAINING | 150 | PLATA | 45 días | 1 hora |
| Pase de Invitado | GUEST_PASS | 80 | BRONCE | 30 días | 1 persona |
| 20% Desc. Merchandising | MERCHANDISE_DISCOUNT | 120 | PLATA | 90 días | 20% |
| Consulta Nutricional | NUTRITIONAL_CONSULTATION | 200 | ORO | 60 días | 1 sesión |
| 7 Días Extensión | EXTENSION_DAYS | 180 | ORO | 30 días | 7 días |

---

### 4. **Tabla: `loyalty_redemptions`**

Canjes realizados por los usuarios.

```sql
CREATE TABLE loyalty_redemptions (
    id_loyalty_redemption BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    reward_id BIGINT NOT NULL,
    redemption_code VARCHAR(20) UNIQUE NOT NULL,
    points_spent INT NOT NULL,
    status ENUM('ACTIVE', 'USED', 'EXPIRED', 'CANCELLED') DEFAULT 'ACTIVE',
    redemption_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date DATETIME NOT NULL,
    used_date DATETIME,
    notes TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (reward_id) REFERENCES loyalty_rewards(id_loyalty_reward),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_redemption_code (redemption_code)
);
```

**Generación de código:**
- Formato: `FITZONE-XXXX-YYYY` (ejemplo: `FITZONE-A3B7-9K2M`)
- Debe ser único y aleatorio

---

### 5. **Tabla: `loyalty_tier_benefits`**

Configuración de beneficios por nivel.

```sql
CREATE TABLE loyalty_tier_benefits (
    id_tier_benefit BIGINT PRIMARY KEY AUTO_INCREMENT,
    tier_name ENUM('BRONCE', 'PLATA', 'ORO', 'PLATINO') UNIQUE NOT NULL,
    renewal_discount_percentage INT DEFAULT 0,
    additional_classes_per_month INT DEFAULT 0,
    free_guest_passes_per_month INT DEFAULT 0,
    priority_reservations BOOLEAN DEFAULT FALSE,
    description TEXT,
    months_required INT NOT NULL,
    
    INDEX idx_tier_name (tier_name)
);
```

**Datos iniciales sugeridos:**

```sql
INSERT INTO loyalty_tier_benefits VALUES
(1, 'BRONCE', 0, 0, 0, FALSE, 'Nivel inicial para todos los miembros', 0),
(2, 'PLATA', 5, 2, 1, FALSE, 'Nivel intermedio con beneficios adicionales', 3),
(3, 'ORO', 10, 5, 2, TRUE, 'Nivel avanzado con beneficios premium', 6),
(4, 'PLATINO', 15, 10, 5, TRUE, 'Nivel élite con máximos beneficios', 12);
```

---

## 🔌 Endpoints Requeridos

### **Base URL:** `/api/loyalty`

### 1. **GET /api/loyalty/dashboard**

Dashboard completo con toda la información del usuario.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "idLoyaltyProfile": 1,
      "userId": 123,
      "userEmail": "user@example.com",
      "userName": "Juan Pérez",
      "currentTier": "PLATA",
      "totalPoints": 450,
      "availablePoints": 320,
      "memberSince": "2024-01-15T10:30:00",
      "monthsAsMember": 10,
      "lastActivityDate": "2025-11-06T15:00:00",
      "totalActivitiesLogged": 42,
      "consecutiveLoginDays": 7,
      "totalReferrals": 3,
      "classesAttended": 28,
      "renewalsCompleted": 2,
      "tierBenefits": {
        "tierName": "PLATA",
        "renewalDiscountPercentage": 5,
        "additionalClassesPerMonth": 2,
        "freeGuestPassesPerMonth": 1,
        "priorityReservations": false,
        "description": "Nivel intermedio con beneficios adicionales"
      },
      "monthsToNextTier": 3,
      "nextTier": "ORO"
    },
    "recentActivities": [
      {
        "idLoyaltyActivity": 100,
        "activityType": "CLASS_ATTENDANCE",
        "activityTypeDisplayName": "Asistencia a Clase",
        "pointsEarned": 10,
        "description": "Clase de Spinning",
        "activityDate": "2025-11-06T18:00:00",
        "expirationDate": "2026-11-06T18:00:00",
        "isExpired": false,
        "isCancelled": false
      }
    ],
    "activeRedemptions": [
      {
        "idLoyaltyRedemption": 5,
        "redemptionCode": "FITZONE-A3B7-9K2M",
        "rewardName": "Clase Grupal Gratis",
        "rewardType": "FREE_CLASS",
        "rewardTypeDisplayName": "Clase Gratis",
        "pointsSpent": 50,
        "status": "ACTIVE",
        "redemptionDate": "2025-11-01T10:00:00",
        "expirationDate": "2025-12-01T23:59:59",
        "usedDate": null,
        "canBeUsed": true,
        "notes": null
      }
    ],
    "recommendedRewards": [
      {
        "idLoyaltyReward": 1,
        "name": "Clase Grupal Gratis",
        "description": "Una clase grupal de tu elección",
        "rewardType": "FREE_CLASS",
        "rewardTypeDisplayName": "Clase Gratis",
        "pointsCost": 50,
        "minimumTierRequired": "BRONCE",
        "validityDays": 30,
        "rewardValue": "1 clase",
        "termsAndConditions": "Válido para clases grupales regulares",
        "canUserAfford": true,
        "meetsMinimumTier": true
      }
    ],
    "pointsExpiringInNext30Days": 25,
    "motivationalMessage": "¡Excelente trabajo! Estás a 3 meses de alcanzar el nivel ORO."
  }
}
```

**Lógica del mensaje motivacional:**
- Si está cerca del siguiente nivel: "¡Excelente trabajo! Estás a {X} meses de alcanzar el nivel {TIER}."
- Si está en nivel máximo: "¡Felicidades! Has alcanzado el nivel PLATINO, el más alto."
- Si tiene puntos por expirar: "¡Atención! Tienes {X} puntos que expiran en los próximos 30 días."

---

### 2. **GET /api/loyalty/profile**

Perfil de fidelización del usuario.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "idLoyaltyProfile": 1,
    "userId": 123,
    "userEmail": "user@example.com",
    "userName": "Juan Pérez",
    "currentTier": "PLATA",
    "totalPoints": 450,
    "availablePoints": 320,
    "memberSince": "2024-01-15T10:30:00",
    "monthsAsMember": 10,
    "lastActivityDate": "2025-11-06T15:00:00",
    "totalActivitiesLogged": 42,
    "consecutiveLoginDays": 7,
    "totalReferrals": 3,
    "classesAttended": 28,
    "renewalsCompleted": 2,
    "tierBenefits": { /* ... */ },
    "monthsToNextTier": 3,
    "nextTier": "ORO"
  }
}
```

---

### 3. **GET /api/loyalty/rewards**

Todas las recompensas disponibles.

**Query Params (opcionales):**
- `affordable=true` - Solo recompensas que el usuario puede costear

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "idLoyaltyReward": 1,
      "name": "Clase Grupal Gratis",
      "description": "Una clase grupal de tu elección",
      "rewardType": "FREE_CLASS",
      "rewardTypeDisplayName": "Clase Gratis",
      "pointsCost": 50,
      "minimumTierRequired": "BRONCE",
      "validityDays": 30,
      "rewardValue": "1 clase",
      "termsAndConditions": "Válido para clases grupales regulares",
      "canUserAfford": true,
      "meetsMinimumTier": true
    }
  ]
}
```

**Cálculo de `canUserAfford`:**
- `true` si `user.availablePoints >= reward.pointsCost`

**Cálculo de `meetsMinimumTier`:**
- Orden de niveles: BRONCE < PLATA < ORO < PLATINO
- `true` si el nivel del usuario >= nivel mínimo requerido

---

### 4. **GET /api/loyalty/rewards/affordable**

Solo recompensas que el usuario puede costear.

**Response 200:**
```json
{
  "success": true,
  "data": [
    /* Array de recompensas donde canUserAfford === true */
  ]
}
```

---

### 5. **GET /api/loyalty/rewards/{rewardId}**

Detalle de una recompensa específica.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "idLoyaltyReward": 1,
    "name": "Clase Grupal Gratis",
    /* ... resto de campos ... */
  }
}
```

---

### 6. **POST /api/loyalty/rewards/{rewardId}/redeem**

Canjear una recompensa.

**Request Body:**
```json
{
  "notes": "Quiero usar esto para clase de yoga"
}
```

**Validaciones:**
1. Usuario tiene suficientes puntos
2. Usuario cumple con el tier mínimo
3. Recompensa está activa

**Response 200:**
```json
{
  "success": true,
  "message": "Recompensa canjeada exitosamente",
  "data": {
    "idLoyaltyRedemption": 10,
    "redemptionCode": "FITZONE-X9Y2-K5L8",
    "rewardName": "Clase Grupal Gratis",
    "rewardType": "FREE_CLASS",
    "pointsSpent": 50,
    "status": "ACTIVE",
    "redemptionDate": "2025-11-07T14:30:00",
    "expirationDate": "2025-12-07T23:59:59",
    "canBeUsed": true
  }
}
```

**Proceso:**
1. Validar puntos y tier
2. Restar puntos de `available_points` (NO de `total_points`)
3. Crear registro en `loyalty_redemptions`
4. Generar código único
5. Calcular fecha de expiración: `redemption_date + validity_days`

**Response 400 - Puntos insuficientes:**
```json
{
  "success": false,
  "message": "Puntos insuficientes. Necesitas 50 puntos, tienes 30."
}
```

**Response 403 - Tier insuficiente:**
```json
{
  "success": false,
  "message": "Esta recompensa requiere nivel PLATA o superior."
}
```

---

### 7. **GET /api/loyalty/redemptions**

Todos los canjes del usuario.

**Query Params (opcionales):**
- `status=ACTIVE` - Filtrar por estado

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "idLoyaltyRedemption": 5,
      "redemptionCode": "FITZONE-A3B7-9K2M",
      "rewardName": "Clase Grupal Gratis",
      "rewardType": "FREE_CLASS",
      "rewardTypeDisplayName": "Clase Gratis",
      "pointsSpent": 50,
      "status": "ACTIVE",
      "redemptionDate": "2025-11-01T10:00:00",
      "expirationDate": "2025-12-01T23:59:59",
      "usedDate": null,
      "canBeUsed": true,
      "notes": null
    }
  ]
}
```

---

### 8. **GET /api/loyalty/redemptions/active**

Solo canjes activos del usuario.

**Response 200:**
```json
{
  "success": true,
  "data": [
    /* Array de redemptions donde status === 'ACTIVE' */
  ]
}
```

---

### 9. **GET /api/loyalty/activities**

Historial de actividades del usuario.

**Query Params (opcionales):**
- `limit=10` - Limitar resultados
- `type=CLASS_ATTENDANCE` - Filtrar por tipo

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "idLoyaltyActivity": 100,
      "activityType": "CLASS_ATTENDANCE",
      "activityTypeDisplayName": "Asistencia a Clase",
      "pointsEarned": 10,
      "description": "Clase de Spinning",
      "activityDate": "2025-11-06T18:00:00",
      "expirationDate": "2026-11-06T18:00:00",
      "isExpired": false,
      "isCancelled": false
    }
  ]
}
```

---

### 10. **GET /api/loyalty/tiers/{tierName}/benefits**

Beneficios de un nivel específico.

**Path Params:**
- `tierName`: BRONCE | PLATA | ORO | PLATINO

**Response 200:**
```json
{
  "success": true,
  "data": {
    "tierName": "PLATA",
    "renewalDiscountPercentage": 5,
    "additionalClassesPerMonth": 2,
    "freeGuestPassesPerMonth": 1,
    "priorityReservations": false,
    "description": "Nivel intermedio con beneficios adicionales"
  }
}
```

---

### 11. **GET /api/loyalty/tiers/benefits**

Beneficios de todos los niveles.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "tierName": "BRONCE",
      "renewalDiscountPercentage": 0,
      "additionalClassesPerMonth": 0,
      "freeGuestPassesPerMonth": 0,
      "priorityReservations": false,
      "description": "Nivel inicial para todos los miembros"
    },
    {
      "tierName": "PLATA",
      "renewalDiscountPercentage": 5,
      "additionalClassesPerMonth": 2,
      "freeGuestPassesPerMonth": 1,
      "priorityReservations": false,
      "description": "Nivel intermedio con beneficios adicionales"
    }
    /* ... resto de niveles ... */
  ]
}
```

---

## 🔄 Lógica de Negocio Crítica

### **1. Registro de Actividades Automáticas**

Estas actividades deben registrarse automáticamente:

#### **a) MEMBERSHIP_PURCHASE**
- **Trigger:** Usuario compra una membresía nueva
- **Puntos:** 100
- **Lugar:** Después de confirmar el pago en `/api/memberships`

#### **b) MEMBERSHIP_RENEWAL**
- **Trigger:** Usuario renueva su membresía
- **Puntos:** 50
- **Lugar:** En el endpoint de renovación

#### **c) MEMBERSHIP_UPGRADE**
- **Trigger:** Usuario mejora su plan (Básico → Premium → Elite)
- **Puntos:** 75
- **Lugar:** En el endpoint de cambio de plan

#### **d) CLASS_ATTENDANCE**
- **Trigger:** Usuario asiste a una clase (check-in confirmado)
- **Puntos:** 10
- **Lugar:** En el sistema de reservas/asistencia

#### **e) PAYMENT_ON_TIME**
- **Trigger:** Usuario paga antes de la fecha de vencimiento
- **Puntos:** 20
- **Lugar:** Al procesar el pago

#### **f) EARLY_RENEWAL**
- **Trigger:** Usuario renueva 15+ días antes del vencimiento
- **Puntos:** 40 (adicionales a los 50 de renovación)
- **Lugar:** En el endpoint de renovación

### **2. Actualización de Puntos**

Cada vez que se registra una actividad:

```java
// Pseudocódigo
void registerActivity(userId, activityType, pointsEarned, description) {
    // 1. Crear actividad
    LoyaltyActivity activity = new LoyaltyActivity();
    activity.setUserId(userId);
    activity.setActivityType(activityType);
    activity.setPointsEarned(pointsEarned);
    activity.setDescription(description);
    activity.setExpirationDate(LocalDateTime.now().plusYears(1)); // 1 año
    loyaltyActivityRepository.save(activity);
    
    // 2. Actualizar puntos del perfil
    LoyaltyProfile profile = getLoyaltyProfile(userId);
    profile.setTotalPoints(profile.getTotalPoints() + pointsEarned);
    profile.setAvailablePoints(profile.getAvailablePoints() + pointsEarned);
    profile.setTotalActivitiesLogged(profile.getTotalActivitiesLogged() + 1);
    profile.setLastActivityDate(LocalDateTime.now());
    
    // 3. Verificar upgrade de tier
    checkAndUpgradeTier(profile);
    
    loyaltyProfileRepository.save(profile);
}
```

### **3. Cálculo de Tier (Nivel)**

Basado en **meses como miembro** (no en puntos):

```java
TierName calculateTier(int monthsAsMember) {
    if (monthsAsMember >= 12) return TierName.PLATINO;
    if (monthsAsMember >= 6) return TierName.ORO;
    if (monthsAsMember >= 3) return TierName.PLATA;
    return TierName.BRONCE;
}

void checkAndUpgradeTier(LoyaltyProfile profile) {
    int monthsAsMember = calculateMonthsBetween(profile.getMemberSince(), LocalDateTime.now());
    TierName newTier = calculateTier(monthsAsMember);
    
    if (newTier != profile.getCurrentTier()) {
        profile.setCurrentTier(newTier);
        // Opcional: Registrar actividad de upgrade
        registerActivity(
            profile.getUserId(), 
            ActivityType.TIER_UPGRADE, 
            0, 
            "Ascendido a nivel " + newTier
        );
    }
}
```

### **4. Expiración de Puntos**

Proceso batch (cron job diario):

```java
@Scheduled(cron = "0 0 2 * * *") // 2 AM cada día
void expireOldPoints() {
    LocalDateTime now = LocalDateTime.now();
    
    // Marcar actividades expiradas
    List<LoyaltyActivity> expiredActivities = 
        loyaltyActivityRepository.findByExpirationDateBeforeAndIsExpiredFalse(now);
    
    for (LoyaltyActivity activity : expiredActivities) {
        activity.setIsExpired(true);
        
        // Restar puntos del perfil
        LoyaltyProfile profile = getLoyaltyProfile(activity.getUserId());
        profile.setAvailablePoints(
            Math.max(0, profile.getAvailablePoints() - activity.getPointsEarned())
        );
        loyaltyProfileRepository.save(profile);
    }
    
    loyaltyActivityRepository.saveAll(expiredActivities);
}
```

### **5. Expiración de Canjes**

Proceso batch (cron job diario):

```java
@Scheduled(cron = "0 0 3 * * *") // 3 AM cada día
void expireRedemptions() {
    LocalDateTime now = LocalDateTime.now();
    
    List<LoyaltyRedemption> expiredRedemptions = 
        loyaltyRedemptionRepository.findByExpirationDateBeforeAndStatus(
            now, 
            RedemptionStatus.ACTIVE
        );
    
    for (LoyaltyRedemption redemption : expiredRedemptions) {
        redemption.setStatus(RedemptionStatus.EXPIRED);
    }
    
    loyaltyRedemptionRepository.saveAll(expiredRedemptions);
}
```

### **6. Generación de Código de Canje**

```java
String generateRedemptionCode() {
    String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sin O, 0, I, 1
    Random random = new Random();
    StringBuilder code = new StringBuilder("FITZONE-");
    
    // Primera parte: 4 caracteres
    for (int i = 0; i < 4; i++) {
        code.append(chars.charAt(random.nextInt(chars.length())));
    }
    
    code.append("-");
    
    // Segunda parte: 4 caracteres
    for (int i = 0; i < 4; i++) {
        code.append(chars.charAt(random.nextInt(chars.length())));
    }
    
    // Verificar que sea único
    while (loyaltyRedemptionRepository.existsByRedemptionCode(code.toString())) {
        code = new StringBuilder("FITZONE-");
        // Regenerar...
    }
    
    return code.toString();
}
```

### **7. Cálculo de Meses al Siguiente Tier**

```java
Integer calculateMonthsToNextTier(TierName currentTier, int currentMonths) {
    switch (currentTier) {
        case BRONCE:
            return Math.max(0, 3 - currentMonths);
        case PLATA:
            return Math.max(0, 6 - currentMonths);
        case ORO:
            return Math.max(0, 12 - currentMonths);
        case PLATINO:
            return null; // Ya está en el nivel máximo
        default:
            return null;
    }
}

TierName getNextTier(TierName currentTier) {
    switch (currentTier) {
        case BRONCE: return TierName.PLATA;
        case PLATA: return TierName.ORO;
        case ORO: return TierName.PLATINO;
        case PLATINO: return null;
        default: return null;
    }
}
```

---

## 🎁 Display Names (Traducción de Tipos)

Para mejorar la experiencia del usuario, convertir enums a texto amigable:

### **Activity Types:**
```java
Map<String, String> activityTypeDisplayNames = Map.of(
    "MEMBERSHIP_PURCHASE", "Compra de Membresía",
    "MEMBERSHIP_RENEWAL", "Renovación de Membresía",
    "MEMBERSHIP_UPGRADE", "Upgrade de Membresía",
    "CLASS_ATTENDANCE", "Asistencia a Clase",
    "REFERRAL", "Referido",
    "LOGIN_STREAK", "Racha de Login",
    "EARLY_RENEWAL", "Renovación Anticipada",
    "PAYMENT_ON_TIME", "Pago a Tiempo",
    "SOCIAL_SHARE", "Compartir en Redes",
    "PROFILE_COMPLETION", "Completar Perfil"
);
```

### **Reward Types:**
```java
Map<String, String> rewardTypeDisplayNames = Map.of(
    "FREE_CLASS", "Clase Gratis",
    "RENEWAL_DISCOUNT", "Descuento en Renovación",
    "TEMPORARY_UPGRADE", "Upgrade Temporal",
    "PERSONAL_TRAINING", "Entrenamiento Personal",
    "GUEST_PASS", "Pase de Invitado",
    "MERCHANDISE_DISCOUNT", "Descuento en Merchandising",
    "NUTRITIONAL_CONSULTATION", "Consulta Nutricional",
    "EXTENSION_DAYS", "Extensión de Días"
);
```

---

## ✅ Checklist de Implementación

### **Fase 1: Base de Datos**
- [ ] Crear tabla `loyalty_profiles`
- [ ] Crear tabla `loyalty_activities`
- [ ] Crear tabla `loyalty_rewards`
- [ ] Crear tabla `loyalty_redemptions`
- [ ] Crear tabla `loyalty_tier_benefits`
- [ ] Insertar datos iniciales de `loyalty_tier_benefits`
- [ ] Insertar recompensas de ejemplo en `loyalty_rewards`
- [ ] Crear trigger/listener para crear perfil al registrar usuario

### **Fase 2: Endpoints Core**
- [ ] `GET /api/loyalty/profile`
- [ ] `GET /api/loyalty/dashboard`
- [ ] `GET /api/loyalty/activities`
- [ ] `GET /api/loyalty/rewards`
- [ ] `GET /api/loyalty/rewards/affordable`
- [ ] `GET /api/loyalty/rewards/{id}`
- [ ] `POST /api/loyalty/rewards/{id}/redeem`
- [ ] `GET /api/loyalty/redemptions`
- [ ] `GET /api/loyalty/redemptions/active`
- [ ] `GET /api/loyalty/tiers/{tier}/benefits`
- [ ] `GET /api/loyalty/tiers/benefits`

### **Fase 3: Integraciones Automáticas**
- [ ] Registrar actividad al comprar membresía
- [ ] Registrar actividad al renovar membresía
- [ ] Registrar actividad al hacer upgrade
- [ ] Registrar actividad en asistencia a clases
- [ ] Registrar actividad en pago a tiempo
- [ ] Registrar actividad en renovación anticipada

### **Fase 4: Jobs Automáticos**
- [ ] Cron job para expirar puntos antiguos
- [ ] Cron job para expirar canjes vencidos
- [ ] Cron job para verificar rachas de login
- [ ] Cron job para upgrade automático de tiers

### **Fase 5: Validaciones y Seguridad**
- [ ] Validar autenticación en todos los endpoints
- [ ] Validar que usuario solo acceda a sus datos
- [ ] Validar puntos suficientes al canjear
- [ ] Validar tier mínimo al canjear
- [ ] Prevenir doble canje de misma recompensa
- [ ] Rate limiting en endpoint de canje

---

## 🔒 Seguridad

1. **Autenticación:** Todos los endpoints requieren Bearer token válido
2. **Autorización:** Usuario solo puede ver/modificar sus propios datos
3. **Validación:** Validar todos los inputs del lado del servidor
4. **Rate Limiting:** Limitar canjes a 5 por hora por usuario
5. **Auditoría:** Log de todos los canjes y cambios de puntos

---

## 📊 Métricas y Reportes (Opcional - Admin)

Endpoints adicionales para administradores:

- `GET /api/admin/loyalty/stats` - Estadísticas generales
- `GET /api/admin/loyalty/users` - Lista de usuarios por tier
- `GET /api/admin/loyalty/redemptions` - Todos los canjes
- `POST /api/admin/loyalty/rewards` - Crear nueva recompensa
- `PUT /api/admin/loyalty/rewards/{id}` - Actualizar recompensa

---

## 🚀 Prioridad de Implementación

1. **ALTA (MVP):**
   - Tablas de base de datos
   - Endpoints GET (dashboard, profile, rewards, activities)
   - POST redeem
   - Integración con compra/renovación de membresía

2. **MEDIA:**
   - Cron jobs de expiración
   - Integración con asistencia a clases
   - Endpoints de admin

3. **BAJA (Futuro):**
   - Sistema de referidos
   - Rachas de login
   - Compartir en redes sociales

---

## 📞 Contacto

Si tienen dudas sobre la implementación, pueden consultar:
- La documentación del frontend en `docs/FIDELIZACION_IMPLEMENTADO.md`
- Los tipos TypeScript en `types/loyalty.ts`
- El servicio del frontend en `services/loyaltyService.ts`

---

**Fecha de creación:** 7 de noviembre de 2025  
**Versión:** 1.0  
**Autor:** Frontend Team
