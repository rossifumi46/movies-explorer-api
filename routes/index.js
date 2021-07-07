const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { validateAuth, validateUserBody } = require('../middlewares/validators');
const { createUser, login } = require('../controllers/users');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuth, login);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
