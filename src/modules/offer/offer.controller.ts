import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import OfferResponse from './response/offer.response.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getOffers });

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.createOffer, middlewares: [new ValidateDtoMiddleware(CreateOfferDto)] });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.updateOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateDtoMiddleware(CreateOfferDto)],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumOffers });
  }

  public async getOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async createOffer(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const createdOffer = await this.offerService.create(body);
    const findedOffer = await this.offerService.findById(createdOffer.id);

    this.created(res, fillDTO(OfferResponse, findedOffer));
  }

  public async updateOffer(
    { body, params }: Request<Record<string, string>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    this.ok(res, fillDTO(OfferResponse, updatedOffer));
  }

  public async deleteOffer(
    { params }: Request<Record<string, string>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.deleteById(params.offerId);

    this.noContent(res, fillDTO(OfferResponse, offer));
  }

  public async getOffer(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);

    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async getPremiumOffers(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findIsPremiumByCity(req.params.city);

    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async getComments(
    { params }: Request,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
