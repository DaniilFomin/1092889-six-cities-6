import {DocumentType} from '@typegoose/typegoose';
import {CreateOfferDto} from '../dto/create-offer.dto.js';
import {OfferEntity} from '../offer.entity.js';
import {UpdateOfferDto} from '../dto/update-offer.dto.js';
import {City} from '../../../types/index.js';

interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>,
  find(limit?: number): Promise<DocumentType<OfferEntity>[]>,
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>,
  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>,
  findFavorites(authorId: string): Promise<DocumentType<OfferEntity>[]>,
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>,
  deleteById(offer: string): Promise<DocumentType<OfferEntity> | null>,
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>,
  checkOwner(offerId: string, authorId: string): Promise<boolean>,
  exists(documentId: string): Promise<boolean>
}

export {OfferService};

