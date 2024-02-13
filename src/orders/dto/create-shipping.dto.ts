import { IsMobilePhone, IsNotEmpty, IsOptional, IsPostalCode, IsString } from "class-validator";

export class CreateShippingDto {
  @IsOptional()
  @IsString({message: 'Имя должно быть строкой'})
  name: string;

  @IsNotEmpty({message: 'Телефон не может быть пустым'})
  @IsString({message: 'Телефон должет быть строкой'})
  @IsMobilePhone('ru-RU', {}, {message: 'Телефон должен быть российский'})
  phone: string;

  @IsNotEmpty({message: 'Город не может быть пустым'})
  @IsString({message: 'Город должет быть строкой'})
  city: string;

  @IsNotEmpty({message: 'Адрес не может быть пустым'})
  @IsString({message: 'Адрес должет быть строкой'})
  address: string;

  @IsNotEmpty({message: 'Почтовый код не может быть пустым'})
  @IsString({message: 'Почтовый код должет быть строкой'})
  @IsPostalCode('RU', {message: 'Почтовый код должен быть российский'})
  postCode: string;

  @IsNotEmpty({message: 'Комментарий не может быть пустым'})
  @IsString({message: 'Комментарий должет быть строкой'})
  comment: string;
}