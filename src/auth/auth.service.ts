import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { ActivateUserDto } from './dto/activate-user.dto';

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
                // activationToken: Math.floor(100000 + Math.random() * 900000),
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
            user,
        }; 
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
