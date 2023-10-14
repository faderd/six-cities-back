import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO, setIsFavoriteFlag } from '../../utils/common.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import OfferResponse from '../offer/response/offer.response.js';
import { UserServiceInterface } from '../user/user-service.interface.js';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,

    @inject(Component.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface,
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface,

    private privateRouteMiddleware = new PrivateRouteMiddleware(),
    private validateOfferIdMiddleware = new ValidateObjectIdMiddleware(
      'offerId',
    ),
  ) {
    super(logger, configService);
    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
      middlewares: [this.privateRouteMiddleware],
    });

    this.addRoute({
      path: '/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.toggleFavoriteOffer,
      middlewares: [
        this.privateRouteMiddleware,
        this.validateOfferIdMiddleware,
      ],
    });
  }

  public async getFavoriteOffers(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findIsFavoriteByUserId(req.user.id);

    setIsFavoriteFlag(
      offers,
      await this.userService.getFavoriteIdsByUserId(req.user?.id),
    );
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async toggleFavoriteOffer(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.toggleIsFavoriteById(
      req.params.offerId,
      +req.params.status,
      req.user.id,
    );

    setIsFavoriteFlag(
      [offer],
      await this.userService.getFavoriteIdsByUserId(req.user?.id),
    );
    this.ok(res, fillDTO(OfferResponse, offer));
  }
}
