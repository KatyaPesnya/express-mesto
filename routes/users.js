const router = require('express').Router();
// eslint-disable-next-line no-unused-vars
const User = require('../models/user');
const { getUsers, getUserById, createUser } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

module.exports = router;
