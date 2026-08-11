export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
