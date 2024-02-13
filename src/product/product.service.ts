import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import dataSource from 'db/data-source';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService)) private readonly orderService: OrdersService
  ) { }

  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(+createProductDto.category_id)
    const product = this.productRepository.create(createProductDto)

    product.category_ = category;
    product.user_ = currentUser;

    return await this.productRepository.save(product);
  }

  async findAll(query: any): Promise<{products: any[], totalProducts: number, limit: number}> {
    let limit: number;

    if (!query.limit) {
      limit = 4;
    } else {
      limit = query.limit;
    }

    const queryBuilder = dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_', 'category_')
      .leftJoin('product.reviews', 'review')
      .addSelect([
        'count(review.id) AS reviewCount',
        'avg(review.ratings)::numeric(10,2) AS avgRating'
      ])
      .groupBy('product.id,category_.id');

    const totalProducts = await queryBuilder.getCount();

    if (query.search) {
      const { search } = query;
      queryBuilder.andWhere("product.title like :title", { title: `%${search}%` })
    }
    if (query.category) {
      queryBuilder.andWhere("category_.id=:id", { id: query.category })
    }
    if (query.minPrice) {
      queryBuilder.andWhere('product.price>=:minPrice', { minPrice: query.minPrice })
    }
    if (query.maxPrice) {
      queryBuilder.andWhere('product.price<=:maxPrice', { maxPrice: query.maxPrice })
    }
    if (query.minRating) {
      queryBuilder.andHaving("AVG(review.ratings) >=:minRating", { minRating: query.minRating })
    }
    if (query.maxRating) {
      queryBuilder.andHaving("AVG(review.ratings) <=:maxRating", { maxRating: query.maxRating })
    }

    queryBuilder.limit(limit);

    if (query.offset) {
      queryBuilder.offset(query.offset)
    }

    const products = await queryBuilder.getRawMany();

    return {products, totalProducts, limit};
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        user_: true,
        category_: true
      },
      select: {
        user_: {
          id: true,
          name: true,
          email: true
        },
        category_: {
          id: true,
          title: true
        }
      }
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);
    product.user_ = currentUser;

    if (updateProductDto.category_id) {
      const category = await this.categoryService.findOne(+updateProductDto.category_id);
      product.category_ = category;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    const order = await this.orderService.findOneByProductId(product.id)
    if (order)  {
      throw new BadRequestException('Продукт используется')
    }
    return await this.productRepository.remove(product);
  }

  async updateStock(id: number, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.SHIPPED) {
      product.stock -= stock;
    }
    if (status === OrderStatus.CANCELLED) {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
