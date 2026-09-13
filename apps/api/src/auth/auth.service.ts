import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

export interface QuizQuestion {
  id: number;
  scenario: string;
  category: string;
  options: {
    id: string;
    text: string;
    isKey: boolean;
  }[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      category: 'Sisterhood Solidarity',
      scenario: "A sister in the sanctuary community texts: 'I\'m caught out without sanitary pads and my cycle started out of nowhere.' What is your natural instinct?",
      options: [
        { id: 'a', text: "Check my bag/stash for a spare, or share a fast delivery recommendation.", isKey: true },
        { id: 'b', text: "Tell her she should have planned better and change the topic.", isKey: false },
      ],
    },
    {
      id: 2,
      category: 'Emotional Empathy',
      scenario: "A close girlfriend cancels dinner last minute saying: 'My cramps are terrible, I\'m bloated, and feeling completely drained.' What is your response?",
      options: [
        { id: 'a', text: "'Take all the time you need babe! Heat pad, soft blanket, and zero guilt.'", isKey: true },
        { id: 'b', text: "'You are being dramatic, just take a pill and come out.'", isKey: false },
      ],
    },
    {
      id: 3,
      category: 'Universal Care Protocol',
      scenario: "You notice another woman in a shared space discreetly looking anxious and gesturing toward the back of her light trousers. What is the sisterhood protocol?",
      options: [
        { id: 'a', text: "Discreetly step in, let her know quietly, and offer a jacket or cardigan to tie around her waist.", isKey: true },
        { id: 'b', text: "Pretend not to notice and quickly walk past.", isKey: false },
      ],
    },
  ];

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const existingUsername = await this.prisma.profile.findUnique({
      where: { username: dto.username.toLowerCase() },
    });
    if (existingUsername) {
      throw new ConflictException('This username is already taken. Please choose another.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        profile: {
          create: {
            username: dto.username.toLowerCase(),
            displayName: dto.displayName,
            avatarUrl: null,
            bio: "Member of the Ease & Bloom sanctuary 🌸",
          },
        },
      },
      include: { profile: true },
    });

    const token = this.generateToken(user);
    return {
      message: 'Account created successfully! Please complete the quick verification quiz.',
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException(user.suspendedReason || 'Account suspended by moderation.');
    }

    const token = this.generateToken(user);
    return {
      message: 'Welcome back to your sanctuary.',
      user: this.sanitizeUser(user),
      token,
    };
  }

  getQuizQuestions() {
    // Return questions without revealing the key answer flag to client
    return this.quizQuestions.map((q) => ({
      id: q.id,
      category: q.category,
      scenario: q.scenario,
      options: q.options.map((o) => ({ id: o.id, text: o.text })),
    }));
  }

  async verifyQuiz(userId: string, answers: string[]) {
    if (!answers || answers.length !== this.quizQuestions.length) {
      throw new BadRequestException('Please answer all 3 verification scenarios.');
    }

    // Check if answers match the empathetic sisterhood key choices
    const allCorrect = this.quizQuestions.every((q, idx) => {
      const selectedId = answers[idx];
      const matchingOption = q.options.find((o) => o.id === selectedId);
      return matchingOption && matchingOption.isKey;
    });

    if (!allCorrect) {
      throw new BadRequestException({
        error: 'QUIZ_FAILED',
        message: 'Your responses did not match our community care ethos. Please review the scenarios and try again.',
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        quizVerified: true,
        quizCompletedAt: new Date(),
      },
      include: { profile: true },
    });

    const token = this.generateToken(updatedUser);
    return {
      message: 'Welcome to Ease & Bloom! You have unlocked full sanctuary participation.',
      user: this.sanitizeUser(updatedUser),
      token,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) {
      throw new UnauthorizedException('User session invalid.');
    }
    return this.sanitizeUser(user);
  }

  private generateToken(user: any) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      quizVerified: user.quizVerified,
    });
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
