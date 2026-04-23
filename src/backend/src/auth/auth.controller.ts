import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserSummaryDto } from './dto/user-summary.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create account' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: AuthTokensResponseDto })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AuthTokensResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Current user (JWT required)' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, type: UserSummaryDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  profile(@Req() req: { user: { id: string; email: string } }) {
    return req.user;
  }
}
