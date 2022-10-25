import CreateUserDto from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';
import { UserServiceInterface } from './user-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import loginUserDto from './dto/login-user.dto.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';
import UpdateUserDto from './dto/update-user.dto.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) { }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, favoriteOffersId: [], avatarPath: DEFAULT_AVATAR_FILE_NAME });
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ id });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async verifyUser(dto: loginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async addFavoriteOffer(offerId: string, userId: string): Promise<DocumentType<UserEntity> | null> {
    let favoriteOffersId = (await this.userModel.findById(userId))?.favoriteOffersId;

    favoriteOffersId?.push(offerId);

    favoriteOffersId = Array.from(new Set(favoriteOffersId));

    return this.userModel.findByIdAndUpdate(userId, { 'favoriteOffersId': favoriteOffersId }, { new: true }).exec();
  }

  public async removeFavoriteOffer(offerId: string, userId?: string): Promise<DocumentType<UserEntity> | null> {

    if (!userId) {
      // если userId не передан, то удаляет offerId из избранного у всех пользователей
      this.userModel.updateMany({}, { $pull: { 'favoriteOffersId': offerId } }).exec();
    }

    const favoriteOffersId = (await this.userModel.findById(userId))?.favoriteOffersId;

    const indexOfferId = favoriteOffersId?.findIndex((offersIdItem) => offersIdItem === offerId);

    if (indexOfferId !== undefined) {
      favoriteOffersId?.splice(indexOfferId, 1);
    }

    return this.userModel.findByIdAndUpdate(userId, { 'favoriteOffersId': favoriteOffersId }, { new: true }).exec();
  }

  public async getFavoriteIdsByUserId(userId: string): Promise<string[] | null> {
    const favoriteOffersId = (await this.userModel.findById(userId))?.favoriteOffersId || null;
    return favoriteOffersId;
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec();
  }
}
