import { Schema, model } from 'mongoose';

const gameSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  photo: String,
  description: String,
  releaseDate: Date,
  language: String,
  slug: String,
});

const Game = model('Game', gameSchema);

export default Game;
