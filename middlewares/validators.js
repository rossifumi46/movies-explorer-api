const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlValidator = (value, helpers) => {
// Throw an error (will be replaced with 'any.custom' error)

  if (!validator.isURL(value)) {
    return helpers.message('Неверный URL');
  }

  // Return the value unchanged
  return value;
};

module.exports.validateProfileBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

module.exports.validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(urlValidator, 'URL validation').required(),
    trailer: Joi.string().custom(urlValidator, 'URL validation').required(),
    thumbnail: Joi.string().custom(urlValidator, 'URL validation').required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validateDeleteParams = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
});

module.exports.validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});
