import { IsString, IsOptional, MaxLength, IsEnum, IsBoolean, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DMPrivacy } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Sarah J.' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  displayName?: string;

  @ApiPropertyOptional({ example: 'Advocate for hormonal balance and women\'s mental health 🌸' })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ enum: DMPrivacy, example: DMPrivacy.MUTUAL_FOLLOWS })
  @IsOptional()
  @IsEnum(DMPrivacy)
  dmPrivacy?: DMPrivacy;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiPropertyOptional({ example: '22:00', description: 'Start of quiet hours in HH:mm' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'quietHoursStart must be in HH:mm format (e.g. 22:00)' })
  quietHoursStart?: string;

  @ApiPropertyOptional({ example: '08:00', description: 'End of quiet hours in HH:mm' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'quietHoursEnd must be in HH:mm format (e.g. 08:00)' })
  quietHoursEnd?: string;
}
