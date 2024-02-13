import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { SerializeIncludes, SerializeInterceptor } from 'src/utility/interceptors/serialize.interceptor';
import { ProductsDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post('create')
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ProductEntity> {
    return await this.productService.create(createProductDto, currentUser);
  }

  @SerializeIncludes(ProductsDto)
  @Get('search')
  async findAll(@Query() query: any): Promise<ProductsDto> {
    return await this.productService.findAll(query);
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ProductEntity> {
    return this.productService.update(+id, updateProductDto, currentUser);
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(+id);
  }
}
