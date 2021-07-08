const Card = require('../models/card');

const {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FAUND, OK,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FAUND).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FAUND).send({ message: 'Переданы некорректные данные для постановки лайка. ' });
        return;
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FAUND).send({ message: 'Переданы некорректные данные при снятии лайка. ' });
        return;
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};
module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
