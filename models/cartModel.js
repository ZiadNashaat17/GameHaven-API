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
        price: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
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

cartSchema.pre('save', function (next) {
  this.totalPrice = 0;
  if (Array.isArray(this.items) && this.items.length) {
    this.items.forEach(item => {
      this.totalPrice += Number(item.totalPrice) || 0;
    });
  }
  next();
});

// cartSchema.post(/^findOneAnd/, function () {
//   if (Array.isArray(this.items) && this.items.length) {
//     this.items.forEach(item => {
//       this.totalPrice = this.totalPrice + item.totalPrice;
//     });
//   }
// });

// cartSchema.post(/^find/, function () {
//   this.items.forEach(item => {
//     let itemTotalPrice = item.quantity * item.price;
//     this.totalPrice = this.totalPrice + itemTotalPrice;
//   });
// });

const Cart = model('Cart', cartSchema);

export default Cart;
