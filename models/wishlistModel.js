import { Schema, model } from 'mongoose';

const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1, items: 1 }, { unique: true });

wishlistSchema.pre(/^find/, function (next) {
  this.populate('items');

  next();
});

const Wishlist = model('Wishlist', wishlistSchema);

export default Wishlist;
