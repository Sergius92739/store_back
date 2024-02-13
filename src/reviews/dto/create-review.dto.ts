import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty({message: 'ID продукта не должно быть пустым'})
  @IsNumber({}, {message: 'ID продукта должно быть числом'})
  product_id: number;

  @IsNotEmpty({message: 'Оценка не должна быть пустой'})
  @IsNumber({}, {message: 'ID продукта должно быть числом'})
  ratings: number;

  @IsNotEmpty({message: 'Комментарий не должен быть пустым'})
  @IsString({message: 'Комментарий должен быть строкой'})
  comment: string;
}
