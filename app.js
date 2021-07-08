const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const notFaundRoutes = require('./routes/notFaund');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use((req, res, next) => {
  req.user = {
    _id: '60e2988c3999071d49af7cf0', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/', express.json());
app.use(helmet());
app.use('/', usersRoutes);
app.use('/', cardsRoutes);
app.use('*', notFaundRoutes);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
