"use strict";

const router = require('express').Router(),
    userRoutes = require('./userRoutes'),
    movieRoutes = require('./movieRoutes'),
    reviewRoutes = require('./reviewRoutes');

router.use('/', userRoutes);
router.use('/movies', movieRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;