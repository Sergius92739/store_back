import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService
  ) { }

  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(+createProductDto.category_id)
    const product = this.productRepository.create(createProductDto)

    product.category_ = category;
    product.user_ = currentUser;

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
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

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
