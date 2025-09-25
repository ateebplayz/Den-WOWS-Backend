import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {AdminKeyGuard} from "./admin-key.guard";
import {IsString} from "class-validator";
import {FeatureFlagGuard, RequireFlag} from "../flags/flag.guard";

class LoginDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AdminKeyGuard)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return { user };
  }

  @RequireFlag('global')
  @UseGuards(FeatureFlagGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      return { error: 'Invalid credentials' }; // optionally throw UnauthorizedException
    }
    return this.authService.login(user);
  }
}
