import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity) private readonly opRepository: Repository<OrdersProductsEntity>,
    @Inject(forwardRef(() => ProductService)) private readonly productService: ProductService
  ) { }

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity> {
    for (const prod of createOrderDto.orderedProducts) {
      const product_ = await this.productService.findOne(prod.id);
      if (prod.product_quantity > product_.stock) {
        throw new BadRequestException(`Количество заказанного товара ${product_.title} превышает наличие`)
      }
    }

    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user_ = currentUser;

    const order = await this.orderRepository.save(orderEntity);

    type T_opEntity = {
      order_: OrderEntity;
      product_: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }

    const opEntity: T_opEntity[] = [];

    for (const prod of createOrderDto.orderedProducts) {
      const product_ = await this.productService.findOne(prod.id);
      opEntity.push({
        order_: order,
        product_,
        product_quantity: prod.product_quantity,
        product_unit_price: prod.product_unit_price
      })
    }

    const op = await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute()

    return await this.findOne(order.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user_: true,
        products: { product_: true }
      }
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user_: true,
        products: { product_: true }
      }
    });
  }

  async findOneByProductId(id: number) {
    return await this.opRepository.findOne({
      relations: { product_: true },
      where: { product_: { id } }
    })
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity
  ) {
    let order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Заказ не найден')
    }

    if ((order.status === OrderStatus.DELIVERED) || (order.status === OrderStatus.CANCELLED)) {
      throw new BadRequestException(`Заказ уже ${order.status}`)
    }

    if ((order.status === OrderStatus.PROCESSING) && (updateOrderStatusDto.status !== OrderStatus.SHIPPED)) {
      throw new BadRequestException('Доставка невозможна до отправки')
    }

    if ((updateOrderStatusDto.status === OrderStatus.SHIPPED) && (order.status === OrderStatus.SHIPPED)) {
      return order;
    }
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.status = updateOrderStatusDto.status;
    order.updatedBy_ = currentUser;
    order = await this.orderRepository.save(order);

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      await this.stockUpdate(order, OrderStatus.SHIPPED)
    }

    return order;
  }

  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException('Заказ не найден')
    }

    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }

    order.status = OrderStatus.CANCELLED;
    order.updatedBy_ = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCELLED);
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(op.product_.id, op.product_quantity, status);
    }
  }
}
