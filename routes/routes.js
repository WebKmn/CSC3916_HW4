"use strict";

const router = require('express').Router(),
    userRoutes = require('./userRoutes'),
    movieRoutes = require('./movieRoutes');

router.use('/', userRoutes);
router.use('/movies', movieRoutes);

module.exports = router;