const Movie = require('../models/movie');
const PermissionError = require('../errors/permission-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

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
      if (err.errors) {
        const messages = [];
        // if (err.errors.name) messages.push(err.errors.name.message);
        // if (err.errors.link) messages.push(err.errors.link.message);
        throw new BadRequestError(messages);
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;
  Movie.findById(movieId)
    .orFail(() => { throw new NotFoundError('Фильм не найден'); })
    .then((movie) => {
      if (movie.owner.toString() !== owner) {
        throw new PermissionError('Вы не можете удалить фильм');
      }
      return Movie.findByIdAndRemove(movieId);
    })
    .then((movie) => res.send({ movie }))
    .catch(next);
};
