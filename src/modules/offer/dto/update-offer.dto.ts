import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsMongoId, IsObject, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { MAX_ADULTS, MAX_FILENAME_LENGTH, MAX_ROOMS, OfferDescriptionLengthRange, OfferTitleLengthRange, PriceRange, RatingRange } from '../../../const.js';
import { City, Location } from '../../../types/city.type.js';
import { OfferGood } from '../../../types/offer-good.enum.js';
import { TypeOfHousing } from '../../../types/type-of-housing.enum.js';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(OfferTitleLengthRange.MIN, { message: `Minimum title length must be ${OfferTitleLengthRange.MIN}` })
  @MaxLength(OfferTitleLengthRange.MAX, { message: `Maximum title length must be ${OfferTitleLengthRange.MAX}` })
  public title?: string;

  @IsOptional()
  @MinLength(OfferDescriptionLengthRange.MIN, { message: `Minimum description length must be ${OfferDescriptionLengthRange.MIN}` })
  @MaxLength(OfferDescriptionLengthRange.MAX, { message: `Maximum description length must be ${OfferDescriptionLengthRange.MAX}` })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'postDate must be valid ISO date' })
  public postDate?: Date;

  @IsOptional()
  @IsString({ message: 'city must be an string' })
  public city?: City['name'];

  @IsOptional()
  @MaxLength(MAX_FILENAME_LENGTH, { message: 'Too short for field previewImage' })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: 'Field images must be an array' })
  @IsString({ each: true, message: 'images field must be an array of valid strings' })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: 'ssPremium must be an boolean' })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isFavorite must be an boolean' })
  public isFavorite?: boolean;

  @IsOptional()
  @IsInt({ message: 'rating must be an integer' })
  @Min(RatingRange.MIN, { message: `Minimum rating must be ${RatingRange.MIN}` })
  @Max(RatingRange.MAX, { message: `Maximum rating must be ${RatingRange.MAX}` })
  public rating?: number;

  @IsOptional()
  @IsEnum(TypeOfHousing, { message: `type must be one of ${Object.keys(TypeOfHousing)}` })
  public typeOfHousing?: TypeOfHousing;

  @IsOptional()
  @IsInt({ message: 'rooms must be an integer' })
  @Min(1, { message: `Minimum rooms must be ${1}` })
  @Max(MAX_ROOMS, { message: `Maximum rooms must be ${MAX_ROOMS}` })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: 'maxAdults must be an integer' })
  @Min(1, { message: `Minimum maxAdults must be ${1}` })
  @Max(MAX_ADULTS, { message: `Maximum maxAdults must be ${MAX_ADULTS}` })
  public maxAdults?: number;

  @IsOptional()
  @IsInt({ message: 'price must be an integer' })
  @Min(PriceRange.MIN, { message: `Minimum price must be ${PriceRange.MIN}` })
  @Max(PriceRange.MAX, { message: `Maximum price must be ${PriceRange.MAX}` })
  public price?: number;

  @IsOptional()
  @IsArray({ message: 'Field goods must be an array' })
  @IsEnum(OfferGood, { each: true, message: 'goods field must be is valid' })
  public goods?: OfferGood[];

  @IsOptional()
  @IsMongoId({ message: 'userId field must be valid an id' })
  public userId?: string;

  @IsOptional()
  @IsInt({message: 'commentsCount must be an integer'})
  public commentsCount?: number;

  @IsOptional()
  @IsObject({ message: 'Field location must be is valid' })
  public location?: Location;
}
