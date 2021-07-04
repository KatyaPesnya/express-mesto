// eslint-disable-next-line no-undef
const mongoose = requere('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // имя карточки
    type: String,
    requered: true,
    minlength: 2,
    maxlength: 30,
  },
  link: { // ссылка на картинку
    type: String,
    requered: true,
  },
  owner: { // ссылка на модель аватара карточки
    type: mongoose.Schema.Types.ObjectId,
    requered: true,
  },
  likes: { // список лайкнувших пост пользователей
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', cardSchema);
