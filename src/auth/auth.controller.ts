import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser, Auth, RoleProtected } from './decorators';
import { LoginUserDto, RegisterUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthService){}


    @Post('register')
    registerUser(@Body() registerUserDto: RegisterUserDto){
        return this.authServices.create( registerUserDto );
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto){
        return this.authServices.login( loginUserDto );
    }

    @Get('check-status')
    @Auth()
    checkAuthStatus(
        @GetUser() user: User

    ){
        return this.authServices.checkAuthStatus( user )
    }
}