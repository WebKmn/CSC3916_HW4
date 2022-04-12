"use strict";

const router = require('express').Router(),
    Movie = require("../schemas/Movies"),
    Actor = require("../schemas/Actors"),
    jwtAuthController = require("../auth/auth_jwt");

let getActors = (req) => {
    let actorsList = [];
    let actors = req.body.actors;

    if(!actors){return actorsList;}

    actors.forEach(obj => {
        let actor = new Actor();
        actor.actorName = obj.actorName;
        actor.characterName = obj.characterName;
        actorsList.push(actor);
    })
    return actorsList;
}

router.route('/')
    .get(jwtAuthController.isAuthenticated, (req, res) => {
        let reqQuery = req.query;
        if(reqQuery.reviews === "true"){
            Movie.aggregate([
                {
                    $match: {hasReviews: true}
                },
                {
                    $lookup:{
                        from: "reviews",
                        localField: "_id",
                        foreignField: 'movie',
                        as: "reviews"
                    }
                },
                {
                    $set: {avgRating: {$avg: "$reviews.rating"}}
                }
            ], null, (err, movies) => {
                if(err){
                    return res.status(400).send({success: false, error:err});
                }
                return res.status(200).send({success: true, movies:movies});
            });
        } else {
            Movie.find({}, (err, movies) => {
                if (err){
                    return res.status(400).json({success: false, error:err});
                }
                return res.status(200).send({success:true, movies:movies});
            });
        }
    })
    .post(jwtAuthController.isAuthenticated, (req, res) => {
        let movie = new Movie();
        let actorList = getActors(req);

        movie.title = req.body.title;
        movie.releaseDate = new Date(req.body.releaseDate);
        movie.genre = req.body.genre;
        movie.actors = actorList;

        movie.save((err) => {
            if(err){
                return res.status(400).send({success: false, msg: 'Failed saved new Movie.'});
            }
            return res.status(200).send({success: true, msg: 'Successfully saved new Movie.'});
        });
    })
    .put(jwtAuthController.isAuthenticated, (req, res) => {
        Movie.findOne({title: req.body.title}, null, null,(err, movie) => {
            if (!movie){
                return res.status(400).json({success: false, error:'Movie not found.'});
            }else{
                let actorList = getActors(req);
                // movie.title = req.body.title;
                movie.releaseDate = (!req.body.releaseDate ? '': new Date(req.body.releaseDate));
                movie.genre = req.body.genre;
                movie.actors = actorList;

                if(movie.validateProperties()){
                    movie.save(() => {
                        return res.status(200).send({success: true, msg: 'Successfully updated the Movie.'});
                    });
                } else {
                    return res.status(400).send({success: false, msg: 'Failed to Update Movie'});
                }
            }
        });
    })
    .delete(jwtAuthController.isAuthenticated, (req, res) => {
        Movie.findOneAndDelete({title:req.body.title}, null, (err, movie) => {
            if(!movie){
                return res.status(400).json({success: false, error:'Movie not found.'});
            }
            return res.status(200).json({success: true, msg:'Movie deleted successfully.', deleted: movie});
        });
    });

module.exports = router;