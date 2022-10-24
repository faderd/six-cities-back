import { City } from './types/city.type.js';

export const CITIES: City[] = [
  {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
    }
  }, {
    name: 'Cologne',
    location: {
      latitude: 50.938361,
      longitude: 6.959974,
    }
  }, {
    name: 'Brussels',
    location: {
      latitude: 50.846557,
      longitude: 4.351697,
    }
  }, {
    name: 'Amsterdam',
    location: {
      latitude: 52.37454,
      longitude: 4.897976,
    }
  }, {
    name: 'Hamburg',
    location: {
      latitude: 53.550341,
      longitude: 10.000654,
    }
  }, {
    name: 'Dusseldorf',
    location: {
      latitude: 51.225402,
      longitude: 6.776314,
    }
  },
];

export const PriceRange = {
  MIN: 100,
  MAX: 100000,
};
export const RatingRange = {
  MIN: 1,
  MAX: 5,
  NUM_AFTER_DIGIT: 1,
  DEFAULT_VALUE: 3.5,
};
export const MAX_ADULTS = 10;
export const MAX_ROOMS = 8;
export const OfferTitleLengthRange = {
  MIN: 10,
  MAX: 100,
};
export const OfferDescriptionLengthRange = {
  MIN: 20,
  MAX: 1024,
};
export const MAX_FILENAME_LENGTH = 256;

export const PasswordRequirements = {
  MIN_LENGTH: 6,
  MAX_LENGTH: 12,
};

export const CommentRequirements = {
  MIN_LENGTH: 5,
  MAX_LENGTH: 1024,
};

export const NUM_OF_IMAGES_IN_OFFER = 6;
