import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO, setIsFavoriteFlag } from '../../utils/common.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import OfferResponse from './response/offer.response.js';
import UploadPreviewImageResponse from './response/upload-image.response.js';
import * as core from 'express-serve-static-core';

type ParamsGetOffer = {
  offerId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,

    private validateOfferIdMiddleware = new ValidateObjectIdMiddleware('offerId'),
    private validateCreateOfferDtoMiddleware = new ValidateDtoMiddleware(CreateOfferDto),
    private documentOfferExistMiddleware = new DocumentExistsMiddleware(offerService, 'Offer', 'offerId'),
    private privateRouteMiddleware = new PrivateRouteMiddleware(),
  ) {
    super(logger, configService);
    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getOffers });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [
        this.privateRouteMiddleware,
        this.validateCreateOfferDtoMiddleware,
      ],
    });

    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.getFavoriteOffers, middlewares: [this.privateRouteMiddleware] });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.updateOffer,
      middlewares: [
        this.privateRouteMiddleware,
        this.validateOfferIdMiddleware,
        this.documentOfferExistMiddleware,
        this.validateCreateOfferDtoMiddleware,
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [
        this.privateRouteMiddleware,
        this.validateOfferIdMiddleware,
        this.documentOfferExistMiddleware,
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOffer,
      middlewares: [
        this.validateOfferIdMiddleware,
        this.documentOfferExistMiddleware,
      ],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        this.validateOfferIdMiddleware,
        this.documentOfferExistMiddleware,
      ],
    });

    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumOffers });

    this.addRoute({
      path: '/favorite/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.toggleFavoriteOffer,
      middlewares: [
        this.privateRouteMiddleware,
        this.validateOfferIdMiddleware,
      ],
    });

    this.addRoute({
      path: '/:offerId/previewImage',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        this.privateRouteMiddleware,
        this.validateOfferIdMiddleware,
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ],
    });
  }

  public async getOffers(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    setIsFavoriteFlag(offers, await this.userService.getFavoriteIdsByUserId(req.user?.id));
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async createOffer(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const { body, user } = req;
    const createdOffer = await this.offerService.create({ ...body, userId: user.id });
    const findedOffer = await this.offerService.findById(createdOffer.id);

    this.created(res, fillDTO(OfferResponse, findedOffer));
  }

  public async updateOffer(req: Request, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(req.params.offerId, req.body);

    setIsFavoriteFlag([updatedOffer], await this.userService.getFavoriteIdsByUserId(req.user?.id));
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

    setIsFavoriteFlag([offer], await this.userService.getFavoriteIdsByUserId(req.user?.id));
    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async getPremiumOffers(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findIsPremiumByCity(req.params.city);

    setIsFavoriteFlag(offers, await this.userService.getFavoriteIdsByUserId(req.user?.id));
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async getComments(
    { params }: Request,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async getFavoriteOffers(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findIsFavoriteByUserId(req.user.id);

    setIsFavoriteFlag(offers, await this.userService.getFavoriteIdsByUserId(req.user?.id));
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async toggleFavoriteOffer(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.toggleIsFavoriteById(req.params.offerId, +req.params.status, req.user.id);

    setIsFavoriteFlag([offer], await this.userService.getFavoriteIdsByUserId(req.user?.id));
    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async uploadPreviewImage(req: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response) {
    const { offerId } = req.params;
    const updateDto = { previewImage: req.file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadPreviewImageResponse, { updateDto }));
  }
}
