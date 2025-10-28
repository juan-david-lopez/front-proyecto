# 🛠️ Instrucciones para el Backend: Implementar TODO según el Frontend

Este documento resume todos los procesos, endpoints y validaciones que el frontend de FitZone ya tiene implementados y que requieren soporte en el backend para que la aplicación funcione de forma completa y consistente.

---

## 1. Autenticación y Seguridad

### 1.1. Login y Registro
- **Endpoint:** `POST /auth/login-2fa` (login con email y password, inicia flujo OTP)
- **Endpoint:** `POST /auth/verify-otp` (verifica OTP para login o registro)
- **Endpoint:** `POST /auth/register` (registro de usuario)
- **Endpoint:** `POST /auth/refresh-token` (refresca tokens JWT)
- **Validaciones:**
  - Email y password requeridos
  - OTP requerido y válido
  - Mensajes claros de error (401, 400, 404)

### 1.2. Recuperación y Restablecimiento de Contraseña
- **Endpoint:** `POST /auth/forgot-password?email={email}`
- **Endpoint:** `POST /auth/reset-password` (body: `{ token, newPassword }`)
- **Notas:**
  - Token seguro, temporal y de un solo uso
  - No revelar si el email existe
  - Limitar intentos por IP/usuario

---

## 2. Gestión de Usuarios
- **Endpoint:** `GET /users/{id}` (obtener usuario por ID)
- **Endpoint:** `GET /users/by-email?email={email}`
- **Endpoint:** `GET /users/by-document?documentNumber={doc}`
- **Endpoint:** `PUT /users/{id}` (actualizar datos de usuario)
- **Endpoint:** `DELETE /users/{id}` (eliminación lógica)
- **Endpoint:** `GET /users` (listar usuarios activos)
- **Validaciones:**
  - Roles: CLIENT, INSTRUCTOR, ADMIN, RECEPCION
  - Permisos según rol

---

## 3. Membresías
- **Endpoint:** `GET /membership-types` (listar tipos de membresía)
- **Endpoint:** `GET /memberships/status/{userId}` (estado actual de membresía)
- **Endpoint:** `POST /memberships/activate` (activar membresía tras pago)
- **Endpoint:** `POST /memberships/renew` (renovar membresía)
- **Endpoint:** `POST /memberships/cancel` (cancelar membresía)
- **Endpoint:** `GET /memberships/history/{userId}` (historial de membresías)
- **Validaciones:**
  - Fechas de inicio/fin
  - Estado activo/inactivo
  - Notificaciones de vencimiento

---

## 4. Pagos y Facturación
- **Endpoint:** `POST /payments/create-intent` (crear PaymentIntent Stripe)
- **Endpoint:** `POST /payments/{paymentIntentId}/activate-membership` (activar membresía tras pago)
- **Endpoint:** `GET /payments/receipts/{userId}` (historial de recibos)
- **Endpoint:** `GET /payments/receipt/{receiptId}` (detalle de recibo)
- **Validaciones:**
  - Monto, moneda, usuario y tipo de membresía
  - Estado del pago (succeeded, failed)

---

## 5. Reservas
- **Endpoint:** `GET /reservations/available` (disponibilidad de clases/equipos)
- **Endpoint:** `POST /reservations/create` (crear reserva)
- **Endpoint:** `GET /reservations/user/{userId}` (historial de reservas)
- **Endpoint:** `DELETE /reservations/{reservationId}` (cancelar reserva)
- **Validaciones:**
  - Fechas y horarios válidos
  - Límite de reservas por usuario
  - Notificaciones de confirmación/cancelación

---

## 6. Fidelización
- **Endpoint:** `GET /loyalty/points/{userId}` (consultar puntos)
- **Endpoint:** `POST /loyalty/redeem` (canjear puntos)
- **Endpoint:** `GET /loyalty/history/{userId}` (historial de puntos)
- **Validaciones:**
  - Suficientes puntos para canje
  - Reglas de acumulación y expiración

---

## 7. Notificaciones
- **Endpoint:** `POST /notifications/send` (enviar notificación push/email)
- **Endpoint:** `GET /notifications/user/{userId}` (listar notificaciones)
- **Validaciones:**
  - Tipos: vencimiento, reservas, promociones
  - Estado: leída/no leída

---

## 8. Configuración y Preferencias
- **Endpoint:** `GET /settings/{userId}` (obtener preferencias)
- **Endpoint:** `PUT /settings/{userId}` (actualizar preferencias)
- **Notas:**
  - Temas, accesibilidad, notificaciones

---

## 9. Seguridad y Accesibilidad
- **Validaciones:**
  - Sanitización de inputs
  - Manejo de errores seguro
  - Protección contra ataques de enumeración y fuerza bruta
  - Acceso solo a recursos permitidos según rol

---

## 10. Resumen de Endpoints a Implementar

| Método | Endpoint                                      | Descripción                                 |
|--------|-----------------------------------------------|---------------------------------------------|
| POST   | /auth/forgot-password                         | Recuperación de contraseña                  |
| POST   | /auth/reset-password                          | Restablecer contraseña                      |
| POST   | /auth/login-2fa                               | Login con 2FA                               |
| POST   | /auth/verify-otp                              | Verificar OTP                               |
| POST   | /auth/register                                | Registro de usuario                         |
| POST   | /auth/refresh-token                           | Refrescar token JWT                         |
| GET    | /users/{id}                                   | Obtener usuario por ID                      |
| GET    | /users/by-email                               | Obtener usuario por email                   |
| GET    | /users/by-document                            | Obtener usuario por documento               |
| PUT    | /users/{id}                                   | Actualizar usuario                          |
| DELETE | /users/{id}                                   | Eliminar usuario (lógica)                   |
| GET    | /users                                        | Listar usuarios                             |
| GET    | /membership-types                             | Listar tipos de membresía                   |
| GET    | /memberships/status/{userId}                  | Estado de membresía                         |
| POST   | /memberships/activate                         | Activar membresía                           |
| POST   | /memberships/renew                            | Renovar membresía                           |
| POST   | /memberships/cancel                           | Cancelar membresía                          |
| GET    | /memberships/history/{userId}                 | Historial de membresías                     |
| POST   | /payments/create-intent                       | Crear PaymentIntent Stripe                  |
| POST   | /payments/{paymentIntentId}/activate-membership| Activar membresía tras pago                 |
| GET    | /payments/receipts/{userId}                   | Historial de recibos                        |
| GET    | /payments/receipt/{receiptId}                 | Detalle de recibo                           |
| GET    | /reservations/available                       | Disponibilidad de reservas                  |
| POST   | /reservations/create                          | Crear reserva                               |
| GET    | /reservations/user/{userId}                   | Historial de reservas                       |
| DELETE | /reservations/{reservationId}                 | Cancelar reserva                            |
| GET    | /loyalty/points/{userId}                      | Consultar puntos                            |
| POST   | /loyalty/redeem                               | Canjear puntos                              |
| GET    | /loyalty/history/{userId}                     | Historial de puntos                         |
| POST   | /notifications/send                           | Enviar notificación                         |
| GET    | /notifications/user/{userId}                  | Listar notificaciones                       |
| GET    | /settings/{userId}                            | Obtener preferencias                        |
| PUT    | /settings/{userId}                            | Actualizar preferencias                     |

---

## 11. Referencia de Frontend
- Todos los flujos y pantallas ya están implementados en el frontend.
- El backend debe asegurar que los endpoints y validaciones respondan según lo esperado para una experiencia fluida.
- Consultar los archivos en `/app/` y `/services/` para ver ejemplos de integración.

---

## 12. Contacto
Si tienes dudas sobre el formato, flujos o integración, consulta con el equipo de frontend o revisa la documentación en `/docs` y los servicios en `/services/`.
