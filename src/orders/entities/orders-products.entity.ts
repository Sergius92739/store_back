import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/product/entities/product.entity";

@Entity({ name: 'orders_products' })
export class OrdersProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_unit_price: number;

  @Column()
  product_quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.products)
  order_: OrderEntity;

  @ManyToOne(() => ProductEntity, (prod) => prod.products, { cascade: true })
  product_: ProductEntity
}