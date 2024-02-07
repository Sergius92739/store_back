import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";

export class UsersSignUpDto extends UserSignInDto {
  @IsNotEmpty({ message: 'Имя не может быть пустым.' })
  @IsString({ message: 'Имя должно быть строкой.' })
  name: string;
}