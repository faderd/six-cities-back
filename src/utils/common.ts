import { OfferGood } from '../types/offer-good.enum.js';
import { Offer } from '../types/offer.type.js';
import { TypeOfHousing } from '../types/type-of-housing.enum.js';
import { UserType } from '../types/user-type.enum.js';
import { capitalizeFirstLetter, stringToPascalCase } from './string.js';
import crypto from 'crypto';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import * as jose from 'jose';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../modules/offer/offer.entity.js';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, createdDate, city, previewImage, images, isPremium, isFavorite, rating, typeOfHousing, rooms, maxAdults, price, goods, name, email, avatar, password, userType, commentsCount, latitude, longitude] = tokens;

  return {
    title,
    description,
    postDate: new Date(createdDate),
    city,
    previewImage,
    images: images.split(';')
      .map((url) => (url)),
    isPremium: (isPremium === 'true'),
    isFavorite: (isFavorite === 'true'),
    rating: Number.parseInt(rating, 10),
    typeOfHousing: TypeOfHousing[capitalizeFirstLetter(typeOfHousing) as 'Apartment' | 'House' | 'Room' | 'Hotel'],
    rooms: Number.parseInt(rooms, 10),
    maxAdults: Number.parseInt(maxAdults, 10),
    price: Number.parseInt(price, 10),
    goods: goods.split(';')
      .map((goodsName) => (OfferGood[stringToPascalCase(goodsName) as 'Breakfast' | 'AirConditioning' | 'LaptopFriendlyWorkspace' | 'BabySeat' | 'Washer' | 'Towels' | 'Fridge'])),
    user: { name, email, avatarPath: avatar, password, userType: UserType[userType as 'Pro' | 'NotPro'], favoriteOffersId: [] },
    commentsCount: Number.parseInt(commentsCount, 10),
    location: { latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude) },
  } as Offer;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algoritm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const setIsFavoriteFlag = (offers: DocumentType<OfferEntity>[] | (DocumentType<OfferEntity> | null)[], favoriteIds: string[] | null): (DocumentType<OfferEntity>[] | null) | (DocumentType<OfferEntity> | null)[] => {
  if (favoriteIds === null) {
    offers?.forEach((offer) => {
      if (offer !== null) {
        offer.isFavorite = false;
      }
    });

    return offers;
  }

  offers?.forEach((offer) => {
    if (offer === null) { return; }

    if (favoriteIds.includes(offer.id)) {
      offer.isFavorite = true;
    } else {
      offer.isFavorite = false;
    }
  });

  return offers;
};
