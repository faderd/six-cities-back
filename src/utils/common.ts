import { OfferGood } from '../types/offer-good.enum.js';
import { TypeOfHousing } from '../types/type-of-housing.enum.js';
import { UserType } from '../types/user-type.enum.js';
import { capitalizeFirstLetter, stringToPascalCase } from './string.js';
import crypto from 'crypto';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import * as jose from 'jose';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../modules/offer/offer.entity.js';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validation-error-field.type.js';
import { ServiceError } from '../types/service-error.enum.js';
import { UnknownObject } from '../types/unknown-object.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';
import { Offer } from '../types/offer.type.js';

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
    isFavorite: (isFavorite === 'false'),
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

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details],
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

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    message: constraints ? Object.values(constraints) : [],
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data: UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {

      if (Array.isArray(target[property])) {
        // если это массив ссылок, то нужно его перебрать в цикле
        const paths: string[] = target[property] as string[];
        target[property] = paths.map((path) => {
          const rootPath = DEFAULT_STATIC_IMAGES.includes(path as string) ? staticPath : uploadPath;

          return `${rootPath}/${path}`;
        });
      } else {
        const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;

        target[property] = `${rootPath}/${target[property]}`;
      }
    }));
};
