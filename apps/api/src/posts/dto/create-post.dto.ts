import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateNested, ArrayMinSize, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePollOptionDto {
  @ApiProperty({ example: 'Guided Meditation' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreatePollDto {
  @ApiProperty({ example: 'What helps you unwind after an overwhelming day?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: ['Guided Meditation', 'Warm Bath', 'Walking in Nature', 'Journaling'] })
  @IsArray()
  @ArrayMinSize(2, { message: 'A poll must have at least 2 options.' })
  @IsString({ each: true })
  options: string[];

  @ApiPropertyOptional({ example: 24, description: 'Poll duration in hours' })
  @IsOptional()
  durationHours?: number;
}

export class CreatePostDto {
  @ApiProperty({ example: 'Today I finally embraced listening to my body during my cycle...' })
  @IsString()
  @IsNotEmpty({ message: 'Post content cannot be empty.' })
  @MaxLength(2000, { message: 'Content cannot exceed 2000 characters.' })
  content: string;

  @ApiPropertyOptional({ example: false, description: 'Toggle anonymous posting' })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({ example: 'GRIEF', description: 'Content Warning tag e.g. GRIEF, PREGNANCY_LOSS, EATING_DISORDERS, TRAUMA' })
  @IsOptional()
  @IsString()
  contentWarning?: string;

  @ApiPropertyOptional({ example: ['MentalHealth', 'SelfCare'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @ApiPropertyOptional({ type: CreatePollDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePollDto)
  poll?: CreatePollDto;
}
