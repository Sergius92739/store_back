import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductsEntity } from "./orders-products.entity";

@Entity({name: 'orders'})
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'order_at' })
  orderAt: Timestamp;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @Column({ name: 'shipped_at', nullable: true })
  shippedAt: Date;

  @Column({ name: 'delivered_at', nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.ordersUpdateBy)
  updatedBy_: UserEntity;

  @OneToOne(() => ShippingEntity, (ship) => ship.order, { cascade: true })
  @JoinColumn({name: 'shipping_address_id'})
  shippingAddress: ShippingEntity

  @OneToMany(() => OrdersProductsEntity, (op) => op.order_, {cascade: true})
  products: OrdersProductsEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user_: UserEntity;
}
