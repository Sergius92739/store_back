import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity({ name: 'shippings' })
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({name: 'post_code'})
  postCode: string;

  @Column()
  comment: string;

  @OneToOne(() => OrderEntity, (order) => order.shippingAddress)
  order: OrderEntity
}