const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');

const docs = require('./docs');

router.use('/auth', auth);
router.use('/user', user);

if (process.env.NODE_ENV === 'development') router.use('/docs', docs);

module.exports = router;
