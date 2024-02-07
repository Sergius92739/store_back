import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserSignInDto {
  @IsNotEmpty({ message: 'email не должен быть пустым.' })
  @IsEmail({}, { message: 'Пожалуйста введите валидный email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(6, {message: 'Пароль должен быть не менее 6 символов.'})
  password: string;
}