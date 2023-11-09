import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser, Auth, RoleProtected } from './decorators';
import { LoginUserDto, RegisterUserDto, ResetPassword } from './dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthService){}


    @Post('register')
    registerUser(@Body() registerUserDto: RegisterUserDto){
        return this.authServices.register( registerUserDto );
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
    
    @Get('activation-account')
    findOneInactive( @Query() activateUserDto: ActivateUserDto ){
        return this.authServices.findOneInactive( activateUserDto);
    }
        
    @Get(':email')
    findEmail( @Param() resetPassword: ResetPassword ){
        return this.authServices.findEmail( resetPassword );
    }

    // Todo1: Recuperar la contraseña, se solicita un correo electronico para buscar en la base de datos y si se encuentra se le envia un codigo para que este lo introdusca y recupere la contraseña
    // Todo2: Cambiar la contraseña con un codigo 

}