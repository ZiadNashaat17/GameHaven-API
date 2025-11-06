import { Schema, model } from 'mongoose';

const wishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [
    {
      game: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
      },
      AddedAt: {
        type: Date,
        default: Date.now,
      },
      priceWhenAdded: {
        type: Number,
        required: true,
      },
    },
  ],
});

wishlistSchema.index({ user: 1, 'items.game': 1 }, { unique: true });

wishlistSchema.pre(/^find/, function (next) {
  this.populate('items.game');

  next();
});

const Wishlist = model('Wishlist', wishlistSchema);

export default Wishlist;
