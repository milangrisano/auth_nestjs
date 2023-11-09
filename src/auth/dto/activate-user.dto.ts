import { IsNotEmpty, IsUUID } from "class-validator";

export class ActivateUserDto {

    @IsNotEmpty()
    @IsUUID('4')
    id: string;

    @IsNotEmpty()
    code: string;

}