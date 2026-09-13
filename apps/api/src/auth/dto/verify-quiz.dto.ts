import { IsArray, ArrayMinSize, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyQuizDto {
  @ApiProperty({ 
    example: ['b', 'a', 'a'], 
    description: 'Array of selected option IDs for the 3 This-or-That verification questions' 
  })
  @IsArray()
  @ArrayMinSize(3)
  @IsString({ each: true })
  answers: string[];
}
