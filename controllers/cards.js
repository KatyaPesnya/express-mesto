const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log(req.user._id);
      console.log(card.owner);
      if (card.owner.toString() !== req.user._id) {
        res.status(403).send({ message: 'Нет прав для удаления карточки' });
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then(() => {
            res.status(200).send(card);
          });
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotFaund'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};
module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
