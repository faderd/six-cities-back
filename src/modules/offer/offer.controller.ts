import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import HttpError from '../../common/errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import OfferResponse from './response/offer.response.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getOffers });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.createOffer });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.editOffer });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.removeOffer });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getOffer });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumOffers });
  }

  public async getOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(OfferResponse, offers),
    );
  }

  public async createOffer(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const createdOffer = await this.offerService.create(body);

    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(OfferResponse, createdOffer),
    );
  }

  public async editOffer(
    { body, params }: Request<Record<string, string>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(OfferResponse, updatedOffer),
    );
  }

  public async removeOffer(
    { params }: Request<Record<string, string>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const existsOffer = await this.offerService.findById(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    const result = await this.offerService.deleteById(params.offerId);

    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(OfferResponse, result),
    );
  }

  public async getOffer(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerId} not found.`,
        'OfferController',
      );
    }

    this.send(
      res,
      StatusCodes.OK,
      fillDTO(OfferResponse, offer),
    );
  }

  public async getPremiumOffers(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findIsPremiumByCity(req.params.city);

    this.send(
      res,
      StatusCodes.OK,
      fillDTO(OfferResponse, offers),
    );
  }
}
