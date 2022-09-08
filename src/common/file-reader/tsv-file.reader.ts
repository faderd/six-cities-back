import { readFileSync } from 'fs';
import { OfferGood } from '../../types/offer-good.enum.js';
import { Offer } from '../../types/offer.type.js';
import { TypeOfHousing } from '../../types/type-of-housing.enum.js';
import { UserType } from '../../types/user-type.enum.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, createdDate, city, previewImage, images, isPremium, isFavorite, rating, typeOfHousing, rooms, maxAdults, price, goods, name, email, avatar, password, type, comments, latitude, longitude]) => ({
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
        typeOfHousing: TypeOfHousing[typeOfHousing as 'Apartment' | 'House' | 'Room' | 'Hotel'],
        rooms: Number.parseInt(rooms, 10),
        maxAdults: Number.parseInt(maxAdults, 10),
        price: Number.parseInt(price, 10),
        goods: goods.split(';')
          .map((goodsName) => (OfferGood[goodsName as 'Breakfast' | 'AirConditioning' | 'LaptopFriendlyWorkspace' | 'BabySeat' | 'Washer' | 'Towels' | 'Fridge'])),
        user: { name, email, avatar, password, type: UserType[type as 'Pro' | 'NotPro'] },
        comments: Number.parseInt(comments, 10),
        location: { latitude: Number.parseInt(latitude, 10), longitude: Number.parseInt(longitude, 10) },
      }));
  }
}
