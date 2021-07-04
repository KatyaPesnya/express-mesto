// eslint-disable-next-line no-undef
const mongoose = requere('mongoose');

const userSchema = new mongoose.Schema({
  name: { // имя пользователя
    type: String,
    requered: true,
    minlength: 2,
    maxlength: 30,
  },
  about: { // информация о пользователе
    type: String,
    requered: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: { // ссылка на аватарку
    type: String,
    requered: true,
  },

});

module.exports = mongoose.model('user', userSchema);
