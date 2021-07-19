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
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера.' });
    });
};
const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotFaund'))
    .then((card) => {
      console.log(req.user._id);
      console.log(card.owner);
      if (card.owner.toString() !== req.user._id) {
        res.status(401).send({ message: 'Нет прав для удаления карточки' });
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then(() => {
            res.status(200).send(card);
          });
      }
    })
    .catch((err) => {
      if (err.message === 'NotFaund') {
        res.status(NOT_FAUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotFaund'))
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при постановке лайка.' });
      } else if (err.message === 'NotFaund') {
        res.status(NOT_FAUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера.' });
      }
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotFaund'))
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при снятии лайка. ' });
      } else if (err.message === 'NotFaund') {
        res.status(NOT_FAUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера.' });
      }
    });
};
module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
