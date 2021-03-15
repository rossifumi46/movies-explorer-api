const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const User = require('../models/user');
const { userNotFoundErrorMessage, userConflictErrorMessage } = require('../consts');
const { JWT_SECRET_DEV } = require('../config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMyProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFoundError(userNotFoundErrorMessage); })
    .then(({ email, name }) => res.send({ user: { email, name } }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(({ _id }) => res.send({ _id, email, name }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError(userConflictErrorMessage);
      }
      if (err.errors) {
        const messages = [];
        if (err.errors.email) messages.push(err.errors.email.message);
        if (err.errors.password) messages.push(err.errors.password.message);
        if (err.errors.name) messages.push(err.errors.name.message);
        throw new BadRequestError(messages);
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.errors) {
        const messages = [];
        if (err.errors.name) messages.push(err.errors.name.message);
        if (err.errors.email) messages.push(err.errors.email.message);
        throw new BadRequestError(messages);
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then(({ _id }) => {
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};
