import { CategoryEntity } from "src/categories/entities/category.entity";
import { OrdersProductsEntity } from "src/orders/entities/orders-products.entity";
// import { OrdersProductsEntity } from "src/orders/entities/orders-products.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({name: 'products'})
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0
  })
  price: number;

  @Column()
  stock: number;

  @Column('simple-array')
  images: string[];

  @CreateDateColumn({name: 'created_at'})
  createdAt: Timestamp;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Timestamp;

  @ManyToOne(() => UserEntity, (user) => user.products)
  user_: UserEntity;

  @ManyToOne(() => CategoryEntity, (categ) => categ.products)
  category_: CategoryEntity;

  @OneToMany(() => ReviewEntity, (rev) => rev.product_)
  reviews: ReviewEntity[];

  @OneToMany(() => OrdersProductsEntity, (op) => op.product_)
  products: OrdersProductsEntity[];
}
