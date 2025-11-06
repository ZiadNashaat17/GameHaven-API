import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
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
        min: 1,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

// middleware to update the total quantity and total price
cartSchema.pre('save', function (next) {
  this.items.forEach(item => {
    let itemTotalPrice = item.quantity * item.price;
    this.totalPrice = this.totalPrice + itemTotalPrice;
    console.log('this pre save triggered');
  });

  next();
});

const Cart = model('Cart', cartSchema);

export default Cart;
