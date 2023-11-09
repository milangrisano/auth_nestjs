import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class ResetPassword {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

}