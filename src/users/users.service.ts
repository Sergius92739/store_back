import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersSignUpDto } from './dto/user-signup.dto';
import * as argon2 from 'argon2';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async signup(usersSignUpDto: UsersSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(usersSignUpDto.email);
    if (userExists) {
      throw new BadRequestException('С данной эл. почтой уже зарегестрирован аккаунт')
    }
    usersSignUpDto.password = await argon2.hash(usersSignUpDto.password);
    let user = this.usersRepository.create(usersSignUpDto);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne()
    if (!userExists) {
      throw new BadRequestException('Неверные учетные данные')
    }
    const matchPassword = await argon2.verify(userExists.password, userSignInDto.password);
    if (!matchPassword) {
      throw new BadRequestException('Неверные учетные данные')
    }
    delete userExists.password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({id});
    if (!user) {
      throw new NotFoundException('Пользователь не найден.')
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign({
      id: user.id,
      email: user.email
    }, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME
    })
  }
}
