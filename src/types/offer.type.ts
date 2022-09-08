import { City, Location } from './city.type';
import { OfferGood } from './offer-good.enum';
import { TypeOfHousing } from './type-of-housing.enum';
import { User } from './user.type';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City['name'];
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  typeOfHousing: TypeOfHousing;
  rooms: number;
  maxAdults: number;
  price: number;
  goods: OfferGood[];
  user: User;
  comments: number;
  location: Location;
}

