import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CommentRequirements, RatingRange } from '../../../const.js';

export default class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(CommentRequirements.MIN_LENGTH, CommentRequirements.MAX_LENGTH, { message: `Min length is ${CommentRequirements.MIN_LENGTH}, max is ${CommentRequirements.MAX_LENGTH}` })
  public text!: string;

  @IsMongoId({ message: 'offerId field must be a valid id' })
  public offerId!: string;

  @IsMongoId({ message: 'userId field must be a valid id' })
  public userId!: string;

  @IsInt({ message: 'rating must be an integer' })
  @Min(RatingRange.MIN, { message: `Minimum rating must be ${RatingRange.MIN}` })
  @Max(RatingRange.MAX, { message: `Maximum rating must be ${RatingRange.MAX}` })
  public rating!: number;
}
