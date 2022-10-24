import { inject, injectable } from 'inversify';
import { OfferServiceInterface } from './offer-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { RatingRange } from '../../const.js';
import { UserServiceInterface } from '../user/user-service.interface.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserServiceInterface) private userService: UserServiceInterface,
  ) { }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {

    const result = await (await this.offerModel.create({ ...dto, commentsCount: 0, rating: RatingRange.DEFAULT_VALUE, isFavorite: false }));
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId)
      .populate(['userId'])
      .exec();
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_OFFER_COUNT)
      .populate(['userId'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    // удалим оффер из избранного у всех пользователей
    this.userService.removeFavoriteOffer(offerId);

    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['userId'])
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentsCount: 1,
        }
      }).exec();
  }

  public async findIsPremiumByCity(city: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_PREMIUM_OFFER_COUNT;
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async findIsFavoriteByUserId(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const favoriteOffersId = await this.userService.getFavoriteIdsByUserId(userId) || [];
    const offers = this.offerModel.find({ _id: { $in: favoriteOffersId } });
    return offers
      .sort({ createdAt: SortType.Down })
      .populate(['userId'])
      .exec();
  }

  public async toggleIsFavoriteById(offerId: string, action: number, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const isAddFavoriteOffer = action !== 0;

    if (isAddFavoriteOffer) {
      await this.userService.addFavoriteOffer(offerId, userId);
    } else {
      await this.userService.removeFavoriteOffer(offerId, userId);
    }


    return this.findById(offerId);
  }
}
