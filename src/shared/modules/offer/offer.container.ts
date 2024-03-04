import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {OfferEntity, OfferModel} from './offer.entity.js';
import {Component} from '../../types/index.js';
import {OfferService} from './offer-service.interface.js';
import {DefaultOfferService} from './default-offer.service.js';

const createOfferContainer = () => {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  return offerContainer;
};

export {createOfferContainer};
