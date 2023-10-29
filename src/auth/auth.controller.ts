import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RawHeaders, GetUser } from './decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthService){}


    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto){
        return this.authServices.create( createUserDto );
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto){
        return this.authServices.login( loginUserDto );
    }

    @Get('private')
    @UseGuards( AuthGuard())
    testingPrivateRoute(
        @Req() request: Express.Request,
        @GetUser('isActive') isActive: string,
        @GetUser() user: User,
        @RawHeaders('rawHeaders') rawHeaders: string[],
    ){
        return {
            ok: true,
            message: 'Hola Mundo Privado',
            user,
            isActive,
            rawHeaders,
        }
    }

    @Get('private2')
    @SetMetadata('roles', ['admin','SuperAdmin'])
    @UseGuards( AuthGuard(), UserRoleGuard )
    privateRoute2(
        @GetUser() user:User
    ){
        return {
            ok: true,
            user
        }
    }
}