import { DocumentType } from '@typegoose/typegoose';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferServiceInterface extends DocumentExistsInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findIsPremiumByCity(
    city: string,
    count?: number,
  ): Promise<DocumentType<OfferEntity>[]>;
  findIsFavoriteByUserId(userId: string): Promise<DocumentType<OfferEntity>[]>;
  toggleIsFavoriteById(
    offerId: string,
    action: number,
    userId: string,
  ): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
