import { City } from '../../../types/city.type.js';
import { OfferGood } from '../../../types/offer-good.enum.js';
import { TypeOfHousing } from '../../../types/type-of-housing.enum.js';

export default class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public postDate?: Date;
  public city?: City['name'];
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public rating?: number;
  public typeOfHousing?: TypeOfHousing;
  public rooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: OfferGood[];
  public userId?: string;
  public commentsCount?: number;
  public latitude?: number;
  public longitude?: number;
}
