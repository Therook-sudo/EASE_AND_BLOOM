import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum FlagAction {
  CONFIRM_REMOVAL = 'confirm_removal',
  RESTORE_POST = 'restore_post',
  DISMISS = 'dismiss',
}

export class ResolveFlagDto {
  @ApiProperty({ enum: FlagAction, example: FlagAction.RESTORE_POST })
  @IsEnum(FlagAction)
  action: FlagAction;

  @ApiPropertyOptional({ example: 'Reviewed by moderation team, confirmed benign health discussion.' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AckCrisisDto {
  @ApiPropertyOptional({ example: 'Private warm DM sent offering support & helpline resources.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
