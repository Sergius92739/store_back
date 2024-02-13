import { Exclude, Expose, Transform, Type } from "class-transformer";

export class ProductsDto {
  @Expose()
  totalProducts: number;

  @Expose()
  limit: number;

  @Expose()
  @Type(() => ProductList)
  products: ProductList[]
}

export class ProductList {
  @Expose({ name: 'product_id' })
  id: number;

  @Expose({ name: 'product_title' })
  title: string;

  @Expose({ name: 'product_description' })
  description: string;

  @Expose({ name: 'product_price' })
  price: number;

  @Expose({ name: 'product_stock' })
  stock: number;

  @Expose({ name: 'product_images' })
  @Transform(({ value }) => value.toString().split(','))
  images: string[]

  @Exclude()
  product_created_at: string;
  @Exclude()
  product_updated_at: string;
  @Exclude()
  product_user_id: string;
  @Exclude()
  product_category_id: string;

  @Transform(({ obj }) => {
    return {
      id: obj.category__id,
      title: obj.category__title,
    }
  })

  @Expose()
  category: any;

  
  @Exclude()
  category__id: string;
  @Exclude()
  category__title: string;
  @Exclude()
  category__description: string;
  @Exclude()
  category__created_at: string;
  @Exclude()
  category__updated_at: string;
  @Exclude()
  category__userId: string;

  @Expose({ name: 'reviewcount' })
  review: number;

  @Expose({ name: 'avgrating' })
  rating: number;
}