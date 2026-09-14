import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VotePollDto {
  @ApiProperty({ example: 'option-uuid-123' })
  @IsString()
  @IsNotEmpty()
  optionId: string;
}
