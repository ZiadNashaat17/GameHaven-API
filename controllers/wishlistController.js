import Wishlist from '../models/wishlistModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getAllFromWishlist = catchAsync(async (req, res, next) => {
  const user = req.user.id || req.body.user;
  const wishlist = await Wishlist.find({ user });

  res.status(200).json({
    status: 'success',
    results: wishlist.items.length,
    data: { wishlist },
  });
});

// api/v1/game/:gameId/addToWishlist
export const addToWishlist = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const userId = req.body.user;
  const { game, priceWhenAdded } = req.body;

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create(req.body);
  } else {
    // check duplicate
    const gameExists = wishlist.items.find(item => item.game.toString() === game);

    if (gameExists) {
      return res.status(409).json({
        status: 'fail',
        message: 'Game already in wishlist',
      });
    }

    wishlist.items.push({
      game,
      priceWhenAdded,
    });
  }

  await wishlist.save();

  res.status(201).json({
    status: 'success',
    message: 'Game added to wishlist',
    results: wishlist.items.length,
    data: { wishlist },
  });
});

export const removeAllInWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const deletedItem = await Wishlist.findOneAndDelete({ user: userId });

  if (!deletedItem) {
    return next(new AppError('No Item with this id in your wishlist!', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Item removed from wishlist',
    data: null,
  });
});

export const removeItemFromWishList = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const gameId = req.params.id;

  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    return next(new AppError('Cart not found', 404));
  }

  const initialLength = wishlist.items.length;
  wishlist.items = wishlist.items.filter(item => item.game.id.toString() !== gameId);

  if (wishlist.items.length === initialLength) {
    return next(new AppError('Item not found in cart', 404));
  }

  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    results: wishlist.items.length,
    data: { wishlist },
  });
});
