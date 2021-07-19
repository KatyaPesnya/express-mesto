const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FAUND,
  OK,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера.' });
    });
};
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFaund'))
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные.' });
      } else if (err.message === 'NotFaund') {
        res
          .status(NOT_FAUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Внутренняя ошибка сервера.' });
      }
    });
};
const createUser = (req, res) => {
  console.log(req.body.password);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      console.log({ email: req.body.email, password: hash });
      return User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      });
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера.' });
    });
};
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  // eslint-disable-next-line max-len
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFaund'))
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else if (err.message === 'NotFaund') {
        res
          .status(NOT_FAUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Внутренняя ошибка сервера.' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании.' });
      } else if (err.message === 'NotFaund') {
        res
          .status(NOT_FAUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Внутренняя ошибка сервера.' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
