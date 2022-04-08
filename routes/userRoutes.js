"use strict";

const router = require('express').Router(),
    User = require("../schemas/Users"),
    jwt = require("jsonwebtoken");

router.post('/signup', (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(400).json({success: false, msg: 'Please include both username and password to signup.'})
    }else{
        let user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save((err) => {
            if(err){
                if(err.code === 11000){
                    return res.status(400).json({success: false, message: 'A user with that username already exists. '});
                }else{
                    return res.status(400).json({success: false, error:err});
                }
            }
            return res.status(200).json({success: true, msg: 'Successfully created new user.'});
        });
    }
});

router.post('/signin', (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(400).json({success: false, msg: 'Please include both username and password to sign in.'})
    }

    let userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({username: userNew.username}).select('name username password').exec((err,user) =>{
        if(!user){
            return res.status(401).send({success: false, msg: 'User not found.'});
        }
        user.comparePassword(userNew.password, (isMatch) =>{
            if (isMatch){
                let userToken = {name: user.name, username: user.username};
                let token = jwt.sign(userToken, process.env.SECRET_KEY);
                return res.status(200).json({success: true, token: 'JWT ' + token}); // use this for JWT a.b.c token
                // res.json({success: true, token: token}); // use this for Bearer token
            }else{
                return res.status(401).send({success: false, msg: 'Authentication Failed.'});
            }
        })
    })
});

module.exports = router;