import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Member Profiles')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current member profile with private settings' })
  async getMyProfile(@CurrentUser() user: any) {
    return this.usersService.getMyProfile(user.id);
  }

  @Patch('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile, bio, quiet hours, and DM privacy' })
  async updateMyProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMyProfile(user.id, dto);
  }

  @Get('check-username')
  @ApiOperation({ summary: 'Check if a username handle is available' })
  async checkUsername(@Query('username') username: string) {
    return this.usersService.checkUsernameAvailable(username);
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get public member profile and statistics' })
  async getPublicProfile(@Param('username') username: string) {
    return this.usersService.getPublicProfile(username);
  }
}
