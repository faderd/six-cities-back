import typegoose, {
  defaultClasses,
  getModelForClass,
  Ref,
} from '@typegoose/typegoose';
import {
  MAX_ADULTS,
  MAX_ROOMS,
  OfferDescriptionLengthRange,
  OfferTitleLengthRange,
  PriceRange,
  RatingRange,
} from '../../const.js';
import { City, Location } from '../../types/city.type.js';
import { OfferGood } from '../../types/offer-good.enum.js';
import { TypeOfHousing } from '../../types/type-of-housing.enum.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    minlength: OfferTitleLengthRange.MIN,
    maxlength: OfferTitleLengthRange.MAX,
  })
  public title!: string;

  @prop({
    trim: true,
    required: true,
    minlength: OfferDescriptionLengthRange.MIN,
    maxlength: OfferDescriptionLengthRange.MAX,
  })
  public description!: string;

  @prop({
    required: true,
  })
  public postDate!: Date;

  @prop({
    type: String,
    required: true,
  })
  public city!: City['name'];

  @prop({
    required: true,
    default: '',
  })
  public previewImage!: string;

  @prop({
    type: String,
    required: true,
  })
  public images!: string[];

  @prop({
    required: true,
  })
  public isPremium!: boolean;

  @prop({
    required: true,
  })
  public isFavorite!: boolean;

  @prop({
    required: true,
    min: RatingRange.MIN,
    max: RatingRange.MAX,
  })
  public rating!: number;

  @prop({
    type: () => String,
    enum: TypeOfHousing,
    required: true,
  })
  public typeOfHousing!: TypeOfHousing;

  @prop({
    required: true,
    min: 1,
    max: MAX_ROOMS,
  })
  public rooms!: number;

  @prop({
    required: true,
    min: 1,
    max: MAX_ADULTS,
  })
  public maxAdults!: number;

  @prop({
    required: true,
    min: PriceRange.MIN,
    max: PriceRange.MAX,
  })
  public price!: number;

  @prop({
    type: String,
    required: true,
  })
  public goods!: OfferGood[];

  @prop({
    required: true,
    ref: UserEntity,
  })
  public userId!: Ref<UserEntity>;

  @prop({
    required: true,
  })
  public commentsCount!: number;

  @prop({
    type: Object,
  })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
