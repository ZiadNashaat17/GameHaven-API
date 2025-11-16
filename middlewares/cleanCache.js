import { clearHash } from '../services/cache.js';

export const cleanCache = async (req, res, next) => {
  await next();

  clearHash(req.user._id);
};
