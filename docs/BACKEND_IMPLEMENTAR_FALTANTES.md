# 🛠️ Instrucciones para el Backend: Implementar Endpoints Faltantes según el Frontend

Este documento detalla los procesos y endpoints que el frontend de FitZone ya tiene implementados, pero que requieren soporte o endpoints en el backend para funcionar correctamente.

---

## 1. Recuperación y Restablecimiento de Contraseña

### 1.1. Solicitud de Recuperación
- **Endpoint esperado:** `POST /auth/forgot-password?email={email}`
- **Descripción:**
  - Recibe un email y envía un correo con un enlace de recuperación (token único y temporal).
  - El enlace debe apuntar a `/reset-password?token=...` en el frontend.
- **Respuesta esperada:**
  - `200 OK` si el correo fue enviado (aunque el email no exista, para evitar enumeración).
  - `400/404` si hay error de formato o usuario no encontrado (opcional).

### 1.2. Restablecimiento de Contraseña
- **Endpoint esperado:** `POST /auth/reset-password`
- **Body:**
  ```json
  {
    "token": "<token>",
    "newPassword": "<nueva contraseña>"
  }
  ```
- **Descripción:**
  - Valida el token recibido (debe ser único, temporal y de un solo uso).
  - Si es válido, actualiza la contraseña del usuario.
- **Respuesta esperada:**
  - `200 OK` si la contraseña fue cambiada.
  - `400/401` si el token es inválido o expiró.

---

## 2. Validaciones y Mensajes de Error
- El backend debe devolver mensajes claros y códigos de error estándar:
  - `404` si el email no existe (opcional, por seguridad puede devolver siempre 200)
  - `400/401` si el token es inválido o expiró
  - `200` para éxito

---

## 3. Seguridad
- El token de recuperación debe ser seguro, temporal y de un solo uso.
- No revelar si un email existe o no en la base de datos (para evitar ataques de enumeración).
- Limitar la cantidad de solicitudes de recuperación por usuario/IP.

---

## 4. Resumen de Endpoints a Implementar

| Método | Endpoint                        | Descripción                        |
|--------|----------------------------------|------------------------------------|
| POST   | /auth/forgot-password           | Solicitar recuperación de contraseña|
| POST   | /auth/reset-password            | Restablecer contraseña con token    |

---

## 5. Referencia de Frontend
- El frontend ya tiene implementadas las pantallas `/forgot-password` y `/reset-password`.
- El flujo completo está listo y solo requiere que el backend responda correctamente a los endpoints mencionados.

---

## 6. Contacto
Si tienes dudas sobre el formato o el flujo, consulta con el equipo de frontend o revisa los archivos en `/app/forgot-password/page.tsx` y `/app/reset-password/page.tsx`.
