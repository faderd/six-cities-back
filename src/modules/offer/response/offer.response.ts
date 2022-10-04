import { Expose } from 'class-transformer';
import { City, Location } from '../../../types/city.type.js';
import { OfferGood } from '../../../types/offer-good.enum.js';
import { TypeOfHousing } from '../../../types/type-of-housing.enum.js';

export default class lOfferResponse {
  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: City['name'];

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public typeOfHousing!: TypeOfHousing;

  @Expose()
  public rooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: OfferGood[];

  @Expose()
  public userId!: string;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public location!: Location;
}
