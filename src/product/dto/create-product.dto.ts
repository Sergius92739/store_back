import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  title: string;

  @IsNotEmpty({ message: 'Описание не должно быть пустым' })
  @IsString({ message: 'Описание должно быть строкой' })
  description: string;

  @IsNotEmpty({ message: 'Цена не должна быть пустой' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Цена должна быть числом и максимальная точность = 2' }
  )
  @IsPositive({ message: 'Цена должна быть положительным числом' })
  price: number;

  @IsNotEmpty({ message: 'Количество на складе не должно быть пустым' })
  @IsNumber({}, { message: 'Количество на складе должно быть числом' })
  @Min(0, { message: 'Количество на складе не должно быть отрицательным числом' })
  stock: number;

  @IsNotEmpty({ message: 'Изображение не должно быть пустым' })
  @IsArray({ message: 'Изображение должно быть в формате массива' })
  images: string[];

  @IsNotEmpty({ message: 'Категория не должна быть пустой' })
  @IsNumber({}, { message: 'Категория должна быть числом' })
  category_id: number;
}
