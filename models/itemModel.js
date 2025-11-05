import { Schema, model } from 'mongoose';

const itemSchema = new Schema({
  gameId: {
    type: Schema.ObjectId,
    ref: 'Game',
    required: true,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const Item = model('Item', itemSchema);

export default Item;
