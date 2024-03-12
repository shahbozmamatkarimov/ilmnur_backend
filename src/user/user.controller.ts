import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { NewPasswordDto } from './dto/new-password.dto';
import { RegisterUserDto } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatDto } from '../chat/dto/chat.dto';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { LoginUserDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import UserAgent from 'user-agents';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Registration a new user' })
  @Post('register')
  register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'Login user with send OTP' })
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
    // @Req() req: Request,
  ) {
    // const userAgent = req.headers['user-agent'];
    // const ua = new UserAgent(userAgent);

    // const browser = ua.browser; // String representing the browser name (e.g., 'Chrome')
    // const version = ua.version; // String representing the browser version (e.g., '107.0.0.0')
    // const os = ua.os; // Object containing information about the operating system

    // console.log(`Browser: ${browser}, Version: ${version}, OS: ${os.name}`);
    return this.userService.login(loginUserDto, res);
  }

  // @ApiOperation({ summary: 'Verify login user' })
  // @Post('verifyLogin')
  // verifLogin(
  //   @Body() verifyOtpDto: VerifyOtpDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return this.userService.verifyLogin(verifyOtpDto, res);
  // }

  @ApiOperation({ summary: 'Get all users' })
  // @UseGuards(AuthGuard)
  @Get('getByRole/:role')
  getAll(
    @Param('role') role: string
  ) {
    return this.userService.getAll(role);
  }

  @ApiOperation({ summary: 'Get user reytings' })
  @Get('/reyting')
  getReyting() {
    return this.userService.getReyting();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @ApiOperation({ summary: 'Get users with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.userService.pagination(page, limit);
  }

  // @ApiOperation({ summary: 'New password of user' })
  // // @UseGuards(AuthGuard)
  // @Put('newPassword/:id')
  // newPassword(@Param('id') id: string, @Body() newPasswordDto: NewPasswordDto) {
  //   return this.userService.newPassword(id, newPasswordDto);
  // }

  // @ApiOperation({ summary: 'Forgot password for user' })
  // // @UseGuards(AuthGuard)
  // @Put('forgotPassword/:id')
  // forgotPassword(
  //   @Param('id') id: string,
  //   @Body() forgotPasswordDto: ForgotPasswordDto,
  // ) {
  //   return this.userService.forgotPassword(id, forgotPasswordDto);
  // }

  @ApiOperation({ summary: 'Update user profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('profile/:id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ) {
    return this.userService.update(id, updateDto);
  }


  // create_app(
  //   @Body() chatDto: ChatDto,
  //   @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  // ) {
  //   return this.chatService.create(chatDto, file);
  // }

  @ApiOperation({ summary: 'Update profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseGuards(AuthGuard)
  @Put('profileImage/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateProfileImage(
    @Param('id') id: string,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.userService.updateProfileImage(id, image);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  // @ApiOperation({ summary: 'Get orders with pagination' })
  // @Get('orders/pagination/:page/:limit')
  // orderPagination(@Param('page') page: number, @Param('limit') limit: number) {
  //   return this.orderService.pagination(page, limit);
  // }
}
