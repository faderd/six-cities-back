import { City, Location } from './city.type.js';
import { OfferGood } from './offer-good.enum.js';
import { TypeOfHousing } from './type-of-housing.enum.js';
import { User } from './user.type.js';

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
  commentsCount: number;
  location: Location;
};
