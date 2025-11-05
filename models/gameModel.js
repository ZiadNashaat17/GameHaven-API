import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'Action RPG',
        'Metroidvania',
        'Simulation',
        'Platformer',
        'Roguelike',
        'Sandbox',
        'Action Adventure',
        'Puzzle',
        'RPG',
        'Strategy',
        'Horror',
        'Racing',
        'Sports',
        'Fighting',
      ],
    },
    imageCover: String,
    description: String,
    releaseDate: Date,
    language: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
      set: val => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gameSchema.index({ price: 1 });

gameSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'game',
  localField: '_id',
});

gameSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'reviews',
  });
  next();
});

gameSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Game = model('Game', gameSchema);

export default Game;
