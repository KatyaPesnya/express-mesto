const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const notFaundRoutes = require('./routes/notFaund');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', express.json());
app.use(helmet());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', usersRoutes);
app.use('/', cardsRoutes);
app.use('*', notFaundRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
