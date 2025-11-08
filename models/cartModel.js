import { Schema, model } from 'mongoose';

const cartSchema = new Schema(
  {
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
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.pre('save', async function (next) {
  await this.populate('items.game');

  next();
});

cartSchema.pre('save', function (next) {
  console.log('this is the pre save hook');

  this.totalPrice = 0;
  if (Array.isArray(this.items) && this.items.length) {
    this.items.forEach(item => {
      let itemTotalPrice = Number(item.game.price) * Number(item.quantity);
      this.totalPrice += itemTotalPrice;
    });
  }
  next();
});

const Cart = model('Cart', cartSchema);

export default Cart;
