import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { RatingRange } from '../../const.js';
import { Component } from '../../types/component.types.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferServiceInterface) private OfferService: OfferServiceInterface,
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    const comments = await this.commentModel.find({ offerId: dto.offerId }, {rating: 1}).exec();
    const calculatedRating = +(comments.reduce((sum, current) => sum + current.rating, 0) / comments.length).toFixed(RatingRange.NUM_AFTER_DIGIT);

    this.OfferService.updateById(dto.offerId, {rating: calculatedRating});

    return comment;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();
    return result.deletedCount;
  }
}
