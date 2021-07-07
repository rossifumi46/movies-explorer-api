const userRouter = require('express').Router();

const { updateProfile, getMyProfile } = require('../controllers/users');

const { validateProfileBody } = require('../middlewares/validators');

userRouter
  .get('/me', getMyProfile)
  .patch('/me', validateProfileBody, updateProfile);

module.exports = userRouter;
