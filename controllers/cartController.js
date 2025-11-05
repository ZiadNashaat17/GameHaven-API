import Cart from '../models/cartModel.js';
import catchAsync from '../utils/catchAsync.js';

export const addNewItem = catchAsync(async (req, res, next) => {
  if (!req.body.game) req.body.game = req.params.gameId;
  if (!req.body.user) req.body.user = req.user.id;

  // await Cart.create()
});
