// middlewares/auth.js
require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;
console.log(NODE_ENV);
const jwt = require('jsonwebtoken');
const { authErrorMessage } = require('../consts');
const { JWT_SECRET_DEV } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: authErrorMessage });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    return res
      .status(401)
      .send({ message: authErrorMessage });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
