import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'miPasswordActual123', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  currentPassword: string;

  @ApiProperty({ example: 'miPasswordNuevo456', minLength: 6, maxLength: 255 })
  @IsString()
  @MinLength(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  @MaxLength(255)
  newPassword: string;
}
