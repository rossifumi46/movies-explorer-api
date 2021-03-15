const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const limiter = require('./middlewares/limiter');
const { MONGO_URL } = require('./config');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('returnOriginal', false);

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger); // подключаем логгер запросов
app.use('/', limiter);
app.use(helmet());

// Массив разешённых доменов
const allowedCors = [
  'https://mesto-c4rdesigner.students.nomoreparties.spacek',
  'http://mesto-c4rdesigner.students.nomoreparties.space',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Записываем в переменную origin соответствующий заголовок

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  }
  next();
});

app.options('*', cors());
app.use(bodyParser.json());
app.use('/', router);

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorLogger); // подключаем логгер ошибок
app.use(errorHandler);
app.listen(PORT);
