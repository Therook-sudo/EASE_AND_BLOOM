import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'sarah@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'Sisterhood2026!' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'Sarah Johnson' })
  @IsString()
  @IsNotEmpty({ message: 'Display name is required' })
  displayName: string;

  @ApiProperty({ example: 'sarah_j' })
  @IsString()
  @IsNotEmpty({ message: 'Username handle is required' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
  username: string;
}
