var express = require('express')
var router = express.Router();

var testRouter = require('./testRouter');
var usersRouter = require('./usersRouter');
var subscriptionsRouter = require('./subscriptionsRouter');
var radiostationsRouter = require('./radiostationsRouter');
var songsRouter = require('./songsRouter');
var invoicesRouter = require('./invoicesRouter');

router.use('/test', testRouter);
router.use('/users', usersRouter);
router.use('/subscriptions', subscriptionsRouter);
router.use('/radiostations', radiostationsRouter);
router.use('/songs', songsRouter);
router.use('/invoices', invoicesRouter);

module.exports = router;
