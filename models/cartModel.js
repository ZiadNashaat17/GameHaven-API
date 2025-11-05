import { Schema, model } from 'mongoose';
import Item from './itemModel';

const cartSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [Item],
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

// middleware to update the total quantity and total price
cartSchema.pre('save', function (next) {
  this.totalQuantity = this.items.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  this.updatedAt = Date.now();
  next();
});

const Cart = model('Cart', cartSchema);

export default Cart;
