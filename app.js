const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', express.json());
app.use(helmet());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

//  app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const { message } = err;
//   res.status(statusCode).send({
//     message: statusCode === 500
//       ? 'На сервере произошла ошибка'
//       : message,
//   });
//   next();
// });
app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Неизвестная ошибка сервера' } = err;
  if (err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Некорректное значение идентификатора';
  } else if (err.name === 'ValidationError') {
    statusCode = 404;
    message = 'Переданы некорректные данные';
  }
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
