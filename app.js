/* eslint-disable no-underscore-dangle */
const express = require('express');

const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

// const path = require('path');

// app.use(express.static(path.join(__dirname, 'public')))
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
