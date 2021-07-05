const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.body;
  Card.findByIdAndRemove({ cardId })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = { getCards, deleteCard, createCard };
