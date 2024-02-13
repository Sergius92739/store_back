import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productService: ProductService
  ) { }
  async create(createReviewDto: CreateReviewDto, currentUser: UserEntity): Promise<ReviewEntity> {
    const product = await this.productService.findOne(createReviewDto.product_id);
    let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.product_id);
    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.user_ = currentUser;
      review.product_ = product;
    } else {
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }
    return await this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find({
      relations: {
        user_: true,
        product_: true
      }
    });
  }

  async findAllByProduct(id: number): Promise<ReviewEntity[]> {
    const product = await this.productService.findOne(id);
    return await this.reviewRepository.find({
      where: {
        product_: { id }
      },
      relations: {
        user_: true,
        product_: {
          category_: true
        }
      }
    })
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user_: true,
        product_: {
          category_: true
        }
      }
    })
    if (!review) {
      throw new NotFoundException('Отзыв не найден')
    }

    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    const review = await this.findOne(id)
    return this.reviewRepository.remove(review)
  }

  async findOneByUserAndProduct(userId: number, productId: number): Promise<ReviewEntity> {
    return await this.reviewRepository.findOne({
      where: {
        user_: {
          id: userId
        },
        product_: {
          id: productId
        }
      },
      relations: {
        user_: true,
        product_: {
          category_: true
        }
      }
    })
  }
}
