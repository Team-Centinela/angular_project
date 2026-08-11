/**
 * DTOs para /users/me.
 * Coinciden con los `class-validator` del backend en
 * `backend/src/modules/users/dto/`.
 *
 * Note: el modelo principal `User` ya existe en `models/user.ts`
 * (creado por integrante-1). Aquí solo van los DTOs.
 *
 * Issue relacionado: #30
 */

/**
 * Body para PATCH /users/me/password.
 * El backend valida:
 *  - currentPassword debe ser la contraseña actual
 *  - newPassword debe tener mínimo 6 caracteres
 *  - newPassword debe ser distinta a la actual
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
