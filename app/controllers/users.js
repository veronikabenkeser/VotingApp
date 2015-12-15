var User = require('../models/user');
var Poll = require("../models/poll");
var config = require('../../config/server');
var superSecret = config.secret;
var jwt = require('jsonwebtoken');

module.exports = {
    getAllUsers: function(req, res) {
        console.log(User.model);
        User.find(function(err, users) {
            if (err) return res.send(err);
            res.json(users);
        });
    },
    addUser: function(req, res) {
        //create a new instance of the User model
        var user = new User(req.body);

        //set the users info(comes from the req)
        // user.name = req.body.name;
        // user.email = req.body.email;
        // user.password = req.body.password;

        //save the user to the database and check for errors
        user.save(function(err, user) {
            if (err) {
                if (err.code === 11000) {
                    return res.status(400).json({
                        error: 'A user with that user name already exists.'
                    });

                }
                else {
                    // return res.send(err);
                    if (err) return res.status(500).json({
                        error: err
                    });
                }
            }
            res.json({
                success: true,
                message: 'New user created.'
            });
        });
    },
    getById: function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            // if (err) return res.send(err);
            if (err) res.json({
                error: 'User not found.'
            });
            res.json(user);
        });
    },
    deleteUser: function(req, res) {
        User.remove(req.params.user_id, function(err, user) {
            // if (err) return res.send(err);
            if (err) return res.status(500).json({
                error: 'Error deleting your account.'
            });
            res.json({
                message: 'Your account has been deleted.'
            });
        });
    },
    addPoll: function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) return res.status(400).json(err);
            var poll = new Poll(req.body);

            user.polls.push(poll);

            // add this poll to the user's schema and to the polls collection
            user.save(function(err, user) {
                if (err) return res.status(500).json(err);
                poll.save(function(err, poll) {
                    if (err) return res.status(500).json(err);
                    res.json(user);
                });
            });
        });
    },
    getAllPolls: function(req, res) {
        var userPolls = [];
        //return all polls belonging to this user
        User.findById(req.params.user_id, function(err, user) {
            if (err) return res.status(400).json(err);
            user.polls.forEach(function(poll_id) {
                Poll.findById(poll_id, function(err, poll) {
                    userPolls.push(poll);
                });
            });
        });

        // Poll.findById(req.params.poll_id),function(err,poll){
        //       if (err) return res.status(400).json(req.params);
        //       res.json(poll);
        // }
        res.json(userPolls);
    },
    deleteAllPolls: function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) return res.status(400).json(err);
            //remove all polls belonging to this user
            //(once the model is deleted, it is removed from the collection automatically)
            user.polls.forEach(function(poll_id) {
                Poll.remove({
                    _id: poll_id
                }, function(err, poll) {
                    if (err) return res.status(400).json(err);
                });
            });
            user.polls = [];
            user.save(function(err, user) {
                if (err) return res.status(500).json(err);
                res.json(user);
            });
        });
    },
    deletePoll: function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) return res.status(400).json(err);

            Poll.remove({
                _id: req.params.poll_id
            }, function(err, poll) {
                if (err) return res.status(500).json(err);
            });

            var index = user.polls.indexOf(req.params.poll_id);
            if (index >= 0) {
                user.polls.splice(index, 1);
                return res.json(user);
            }
            else {
                return res.json({
                    error: 'You do not have permission to delete this poll.'
                });
            }
        });
    },
    changeSettings: function(req, res) {
        console.log('req body');
        console.log(req.body);
        var id = req.body.id;
        User.findOne({
            _id: id
        }).select('password').exec(function(err, user) {
            if (err) return res.status(400).json(err);
            //no user with that email found
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            }

            var validPassword = user.comparePassword(req.body.oldPassword);
            if (!validPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            }
            else {
                //update password
                user.password = req.body.newPassword;
                user.save(function(err, user) {
                    if (err) return res.status(500).json({
                        error: err
                    });

                    res.json({
                        message: 'Password has been updated.'
                    });
                });
            }
        });
    }
};