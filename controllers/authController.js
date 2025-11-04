export const register = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });

  next();
};

export const login = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
};
