import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { NewPasswordDto } from './dto/new-password.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatDto } from '../chat/dto/chat.dto';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@ApiTags('Teacher')
@Controller('teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
  ) {}

  @ApiOperation({ summary: 'Registration a new teacher' })
  @Post('register')
  register(
    @Body() registerTeacherDto: RegisterTeacherDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(registerTeacherDto);
    return this.teacherService.register(registerTeacherDto);
  }

  // @ApiOperation({ summary: 'Login teacher with send OTP' })
  // @Post('login')
  // login(@Body() loginTeacherDto: LoginTeacherDto) {
  //   return this.teacherService.login(loginTeacherDto);
  // }

  // @ApiOperation({ summary: 'Verify login teacher' })
  // @Post('verifyLogin')
  // verifLogin(
  //   @Body() verifyOtpDto: VerifyOtpDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return this.teacherService.verifyLogin(verifyOtpDto, res);
  // }

  @ApiOperation({ summary: 'Logout teacher' })
  // @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.teacherService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all teachers' })
  // @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.teacherService.getAll();
  }

  @ApiOperation({ summary: 'Get teacher by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.teacherService.getById(id);
  }

  @ApiOperation({ summary: 'Get teachers with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.teacherService.pagination(page, limit);
  }

  // @ApiOperation({ summary: 'New password of teacher' })
  // // @UseGuards(AuthGuard)
  // @Patch('newPassword/:id')
  // newPassword(@Param('id') id: string, @Body() newPasswordDto: NewPasswordDto) {
  //   return this.teacherService.newPassword(id, newPasswordDto);
  // }

  // @ApiOperation({ summary: 'Forgot password for teacher' })
  // // @UseGuards(AuthGuard)
  // @Patch('forgotPassword/:id')
  // forgotPassword(
  //   @Param('id') id: string,
  //   @Body() forgotPasswordDto: ForgotPasswordDto,
  // ) {
  //   return this.teacherService.forgotPassword(id, forgotPasswordDto);
  // }

  // @ApiOperation({ summary: 'Update teacher profile by ID' })
  // // @UseGuards(AuthGuard)
  // @Patch('profile/:id')
  // updateProfile(
  //   @Param('id') id: string,
  //   @Body() updateTeacherDto: UpdateTeacherDto,
  // ) {
  //   return this.teacherService.updateProfile(id, updateTeacherDto);
  // }

  @ApiOperation({ summary: 'Delete teacher by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteTeacher(@Param('id') id: string) {
    return this.teacherService.deleteTeacher(id);
  }

  // @ApiOperation({ summary: 'Get orders with pagination' })
  // @Get('orders/pagination/:page/:limit')
  // orderPagination(@Param('page') page: number, @Param('limit') limit: number) {
  //   return this.orderService.pagination(page, limit);
  // }
}
