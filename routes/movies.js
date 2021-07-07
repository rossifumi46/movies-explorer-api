const moviesRouter = require('express').Router();

const { saveMovie, getSavedMovies, deleteMovie } = require('../controllers/movies');

const { validateMovieBody, validateDeleteParams } = require('../middlewares/validators');

moviesRouter
  .get('/', getSavedMovies)
  .post('/', validateMovieBody, saveMovie)
  .delete('/:movieId', validateDeleteParams, deleteMovie);

module.exports = moviesRouter;
