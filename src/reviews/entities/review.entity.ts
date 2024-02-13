import { ProductEntity } from "src/product/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ratings: number;

  @Column()
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Timestamp;

  @ManyToOne((type) => UserEntity, (user) => user.reviews)
  user_: UserEntity

  @ManyToOne(type => ProductEntity, (prod) => prod.reviews)
  product_: ProductEntity
}
