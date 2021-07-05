const router = require('express').Router();
// eslint-disable-next-line no-unused-vars
const Card = require('../models/card');
const { getCards, deleteCard, createCard } = require('../controllers/cards');

router.get('/cards', getCards);

router.delete('/cards/:cardId', deleteCard);

router.post('/cards', createCard);
module.exports = router;
