import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Santiago Botero' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'santiago@example.com', maxLength: 150 })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : (value as string),
  )
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: 'miPassword123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(255)
  password: string;
}
