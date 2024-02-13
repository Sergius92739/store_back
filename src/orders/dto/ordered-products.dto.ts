import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedProductsDto {
  @IsNotEmpty({ message: 'Продукт не должен быть пустым' })
  id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Цена должна быть числом и максимальная точность после запятой 2' }
  )
  @IsPositive({ message: 'Цена не должна быть отрицательной' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Количество должно быть числом' })
  @IsPositive({ message: 'Количество не должно быть отрицательным' })
  product_quantity: number;
}