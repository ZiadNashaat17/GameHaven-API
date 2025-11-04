import Game from '../models/gameModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllGames = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Game.find(), req.query).filter().sort().limit().paginate();

  const games = await features.query;

  res.status(200).json({
    status: 'sucess',
    results: games.length,
    data: { games },
  });
});

export const getGame = catchAsync(async (req, res, next) => {
  const gameId = req.params.id;
  const game = Game.findById(gameId);

  if (!game) {
    return next(new AppError('No game found with this ID!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: game,
  });
});

export const createGame = catchAsync(async (req, res, next) => {
  const newGame = await Game.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { newGame },
  });
});

export const updateGame = catchAsync(async (req, res, next) => {
  const gameId = req.params.id;
  const game = Game.findByIdAndUpdate(gameId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!game) {
    return next(new AppError('No game found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: game,
  });
});
