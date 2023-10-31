import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserProfileDto {

    @IsString()
    @IsEmail()
    gender: string;

    @IsNumber()
    @MaxLength(7)
    phone: number;

    @IsString()
    @MinLength(3)
    estado: string;
    
    @IsString()
    @MinLength(3)
    ciudad: string;
    
    @IsString()
    @MinLength(3)
    bankName: string;

}
