import Cart from '../models/cartModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const AddItemToCart = async (req, res, next) => {
  const user = req.user._id;
  const { game, quantity } = req.body;

  let cart = await Cart.findOne({ user });

  if (!cart) {
    cart = await Cart.create({
      user,
      items: [{ game, quantity }],
    });
  } else {
    const existingItemIndex = cart.items.findIndex(item => item.game.toString() === game);

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ game, quantity });
    }

    await cart.save();
  }

  res.status(201).json({
    status: 'success',
    message: 'Item added to cart',
    data: { cart },
  });
};

export const getAllCartItems = async (req, res, next) => {
  const user = req.user._id;
  const cart = await Cart.findOne({ user }).populate('items.game');

  if (!cart) {
    return res.status(200).json({
      status: 'success',
      data: { cart },
    });
  }

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
};

export const removeItemFromCart = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const gameId = req.params.id;

  const cart = await Cart.findOne({ user });

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const existingItemIndex = cart.items.findIndex(item => item.game.toString() === gameId);

  if (existingItemIndex >= 0) {
    if (cart.items[existingItemIndex].quantity === 1) {
      cart.items = cart.items.filter(item => item.game.toString() !== gameId);
      await cart.save();

      return res.status(200).json({
        status: 'success',
        message: 'Item removed from cart',
        data: { cart },
      });
    }
    cart.items[existingItemIndex].quantity--;
  } else {
    return next(new AppError('Item not found in cart', 404));
  }

  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: { cart },
  });
});

export const removeWholeItemFromCart = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const gameId = req.params.id;

  let cart = await Cart.findOne({ user });
  if (!cart) {
    return next(new AppError('No cart found', 404));
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(item => item.game.toString() !== gameId);

  if (cart.items.length === initialLength) {
    return next(new AppError('Item not found in cart', 404));
  }

  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: { cart },
  });
});
