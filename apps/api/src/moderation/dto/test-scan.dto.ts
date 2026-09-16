import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestScanDto {
  @ApiProperty({ example: 'I feel completely overwhelmed by my depression today and want to end it all.' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
