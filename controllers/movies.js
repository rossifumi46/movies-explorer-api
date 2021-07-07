const Movie = require('../models/movie');
const PermissionError = require('../errors/permission-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/bad-request-err');
const { movieConflictErrorMessage, movieNotFoundErrorMessage, PermissionErrorMessage } = require('../consts');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ movies }))
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError(movieConflictErrorMessage);
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;
  Movie.findById(movieId)
    .orFail(() => { throw new NotFoundError(movieNotFoundErrorMessage); })
    .then((movie) => {
      if (movie.owner.toString() !== owner) {
        throw new PermissionError(PermissionErrorMessage);
      }
      return Movie.findByIdAndRemove(movieId);
    })
    .then((movie) => res.send({ movie }))
    .catch(next);
};
