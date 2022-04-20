"use strict";

const router = require('express').Router(),
    jwt = require('jsonwebtoken'),
    User = require('../schemas/Users'),
    Movie = require('../schemas/Movies'),
    Review = require('../schemas/Reviews'),
    jwtAuthController = require("../auth/auth_jwt");

router.route('/')
    .get(jwtAuthController.isAuthenticated, (req, res) => {
        Review.find({}, (err, reviews) => {
            if(err){
                return res.status(400).send({success: false, error:err});
            }
            return res.status(200).send({success: true, reviews:reviews});
        });
    })
    .post(jwtAuthController.isAuthenticated, (req, res) => {
        const token = req.headers['authorization'].split(' ')[1];
        let userToken = jwt.verify(token, process.env.SECRET_KEY, null, null);

        if(!userToken){
            return res.status(400).send({success: false, msg: 'Unable to verify token for Reviews'});
        }

        let review = new Review();

        User.findOne({username: userToken.username}).exec((err, user) => {
            if(!user){
                return res.status(400).send({success: false, msg: 'User not found. Saving Review failed.'});
            }
            review.user = user.username;
        });

        Movie.findOne({title: req.body.movie}).exec((err, movie) => {
            if(!movie){
                return res.status(400).send({success: false, msg: 'Movie not found. Saving Review failed.'});
            }
            movie.hasReviews = true;
            review.movie = movie._id;
            review.rating = req.body.rating;
            review.review = req.body.review;

            movie.save((err) => {
                if(err){
                    return res.status(400).send({success: false, msg: 'Failed to update Movie with Reviews property.'});
                }
            })
            review.save((err) => {
                if(err){
                    return res.status(400).send({success: false, msg: 'Failed saved new Review.'});
                }
                return res.status(200).send({success: true, msg: 'Successfully saved new Review.'});
            });
        });
    })

module.exports = router;