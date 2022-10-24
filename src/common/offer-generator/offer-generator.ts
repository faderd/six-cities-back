import dayjs from 'dayjs';
import { CITIES, MAX_ADULTS, MAX_ROOMS, NUM_OF_IMAGES_IN_OFFER, PriceRange, RatingRange } from '../../const.js';
import { MockData } from '../../types/mock-data.type.js';
import { OfferGood } from '../../types/offer-good.enum.js';
import { TypeOfHousing } from '../../types/type-of-housing.enum.js';
import { UserType } from '../../types/user-type.enum.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

const LOCATION_DEVIATION = 0.001;
const LOCATION_NUM_AFTER_DIGIT = 6;
const MAX_COMMENTS = 10;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) { }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const cityName = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.images);
    const images = getRandomItems<string>(this.mockData.images, NUM_OF_IMAGES_IN_OFFER).join(';');
    const isPremium = getRandomItem<string>(['true', 'false']);
    const isFavorite = getRandomItem<string>(['true', 'false']);
    const rating = generateRandomValue(RatingRange.MIN, RatingRange.MAX, RatingRange.NUM_AFTER_DIGIT);
    const typeOfHousing = getRandomItem<string>([TypeOfHousing.Apartment, TypeOfHousing.Hotel, TypeOfHousing.House, TypeOfHousing.Room]);
    const rooms = generateRandomValue(1, MAX_ROOMS);
    const maxAdults = generateRandomValue(1, MAX_ADULTS);
    const price = generateRandomValue(PriceRange.MIN, PriceRange.MAX);
    const goods = getRandomItems<string>(Object.entries(OfferGood).map(([, value]) => value)).join(';');
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const userType = getRandomItem<string>([UserType.Pro, UserType.NotPro]);
    const commentsCount = generateRandomValue(1, MAX_COMMENTS);

    const city = CITIES.find((cityItem) => cityItem.name === cityName);
    const cityLatitude = city?.location.latitude as number;
    const cityLongitude = city?.location.longitude as number;

    const latitude = generateRandomValue(cityLatitude - LOCATION_DEVIATION, cityLatitude + LOCATION_DEVIATION, LOCATION_NUM_AFTER_DIGIT);
    const longitude = generateRandomValue(cityLongitude - LOCATION_DEVIATION, cityLongitude + LOCATION_DEVIATION, LOCATION_NUM_AFTER_DIGIT);

    return [
      title, description, createdDate, cityName, previewImage, images, isPremium, isFavorite, rating, typeOfHousing, rooms, maxAdults, price, goods, name, email, avatar, password, userType, commentsCount, latitude, longitude
    ].join('\t');
  }
}
