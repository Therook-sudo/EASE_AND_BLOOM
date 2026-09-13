import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyQuizDto } from './dto/verify-quiz.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication & Onboarding')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new community member' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in to the sanctuary' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('quiz-questions')
  @ApiOperation({ summary: 'Retrieve the 3 This-or-That soft verification questions' })
  getQuizQuestions() {
    return this.authService.getQuizQuestions();
  }

  @Post('verify-quiz')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit answers for the This-or-That soft-gate quiz' })
  async verifyQuiz(@CurrentUser() user: any, @Body() dto: VerifyQuizDto) {
    return this.authService.verifyQuiz(user.id, dto.answers);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user and profile' })
  async getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.id);
  }
}
