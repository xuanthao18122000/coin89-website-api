import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { GetMember } from 'src/common/decorators/member.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { SendResponse } from 'src/common/response/send-response';
import { Member } from 'src/database/entities';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/auth.dto';

@ApiTags('2. Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: 'Đăng nhập nhân viên' })
  async signIn(@Body() body: SignInDto) {
    const data = await this.authService.signIn(body);
    return SendResponse.success(data, 'Sign in member successful!');
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Đăng ký nhân viên' })
  async signUp(@Body() body: SignUpDto) {
    const member = await this.authService.signUp(body);
    return SendResponse.success(member.serialize(), 'Sign up member successful!');
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất nhân viên' })
  async signOut(@GetMember() member: Member) {
    this.authService.signOut(member);
    return SendResponse.success([], 'Sign out member successful!');
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  async getProfile(@GetMember() member: Member) {
    return SendResponse.success(
      member.serialize(),
      'Get profile member successful!',
    );
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @GetMember() member: Member,
  ) {
    const updatedMember = await this.authService.updateProfile(body, member);
    return SendResponse.success(
      updatedMember.serialize(),
      'Update profile member successful!',
    );
  }
}
