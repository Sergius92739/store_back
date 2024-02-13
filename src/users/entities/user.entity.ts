import { CategoryEntity } from "src/categories/entities/category.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { Roles } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    array: true,
    default: [Roles.USER]
  })
  roles: Roles[]

  @Column({
    default: '/uploads/default-avatar.png',
    name: 'avatar_path'
  })
  avatarPath: string

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Timestamp

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: Timestamp

  @OneToMany(() => CategoryEntity, (category) => category.user)
  categories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (prod) => prod.user_)
  products: ProductEntity[];

  @OneToMany((type) => ReviewEntity, (rev) => rev.user_)
  reviews: ReviewEntity[];

  @OneToMany(() => OrderEntity, (order) => order.updatedBy_)
  ordersUpdateBy: OrderEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user_)
  orders: OrderEntity[]
}
