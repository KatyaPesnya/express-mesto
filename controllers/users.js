const User = require('../models/user');

const {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FAUND, OK,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(err);
    });
};
const getUserById = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FAUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (res.status(BAD_REQUEST)) {
        res
          .status(BAD_REQUEST)
          .send({
            message: `Переданы некорректные данные при создании пользователя: ${err}`,
          });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FAUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(BAD_REQUEST).send({ message: `Передан некорректный id: ${err}` });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
