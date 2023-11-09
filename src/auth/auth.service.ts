import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto, LoginUserDto, ActivateUserDto, ResetPassword } from './dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register( registerUserDto: RegisterUserDto){
        try {
            const { password, ...userData } = registerUserDto;
            const user = this.userRepository.create({
                // activationToken: Math.floor(100000 + Math.random() * 900000), //Todo: utilizar este codigo de javasript para generar el codigo
                ...userData,
                password: bcrypt.hashSync( password, 10 )
            })

            await this.userRepository.save( user )
            delete user.password;
            return {
                ...user,
                token: this.getJwtToken({ id: user.id })
            };            
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    // TODO: CUANDO EL USUARIO ESTE INACTIVO DEBE INFORMARLE QUE LO DEBE ACTIVAR
    
    async login( loginUserDto: LoginUserDto ){
        
        const { password, email } = loginUserDto;
        const user = await  this.userRepository.findOne({
            where: { email },
            select: { email: true, password: true, id: true }
        });
        if ( !user )
            throw new UnauthorizedException('Not Valid Credential, email not valid');
        if ( !bcrypt.compareSync( password, user.password ) )
            throw new UnauthorizedException('Not Valid Credential, password not valid');
        
        return {
            ...user,
            token: this.getJwtToken({ id: user.id })
        };
    }

    async findOneInactive( activateUserDto: ActivateUserDto ){
        const { id, code } = activateUserDto
        const user = await this.userRepository.findOneBy({
            id,
            isActive: false,
            activationToken: code
        });
            if( !user )
                throw new NotFoundException('Invalid Code')
        return {
            isActive: this.activeUser(user),
            //Todo return this message: 'Activated user please log in again' 
        }; 
    }
    
    //!Nota:
    //* Se utiliza para encontrar el email de un usuario que quiere resetear su
    //* contraseña, se le debe generar un codigo aleatorio de 6 digitos para
    //* coincida con el de la base de datos y despues debe colocarse en null y 
    //* generarse otro nuevo por seguridad

    async findEmail( resetPassword: ResetPassword ){
        const { email } = resetPassword
        const user = await this.userRepository.findOneBy({ email });
            if( !user )
                throw new NotFoundException('Invalid Email')
        return 'PLEASE, Check your email registered email, reset code was sent';
        //Todo: Enviar el correo electronico con el codigo generado
    }
    
    private activeUser(user: User){
        user.isActive = true;
        this.userRepository.save(user);
    }

    async checkAuthStatus ( user: User ){
        return {
            ...user,
            token: this.getJwtToken({ id: user.id })
        };
    }

    private getJwtToken( payload: JwtPayload ) {
        const token = this.jwtService.sign( payload );
        return token;        
    }

    private handleDBErrors( error: any ): never {
        if ( error.code === '23505')
            throw new BadRequestException ( error.detail );
        console.log(error)
        throw new InternalServerErrorException('Please check server log');
        
    }
    //!OJO: Manejar el error cuando colocan un email duplicado
}
