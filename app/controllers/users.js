var User = require('../models/user');
var Poll = require("../models/poll");
var Option = require("../models/option");
var config = require('../../config/server');
var superSecret = config.secret;
var jwt = require('jsonwebtoken');
var async = require('async');

module.exports = {
    getAllUsers: function(req, res) {
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
        var self =this;
        User.findById(req.params.user_id, function(err, user) {
            if (err) return res.status(400).json(err);
            
            self.saveOptions(req.body.options)
                    .then(function(optionsArr) {
                          var pollName = req.body.name;
                          self.savePoll(pollName, optionsArr)
                                .then(function(poll){
                                    user.polls.push(poll);
                                    user.save(function(err, user){
                                        if (err) return res.status(500).json(err);
                                        res.json(poll);
                                    });
                                }, function(err){
                                    return res.status(500).json(err);
                                });
                        }, function(err) {
                          console.log(err);
                          return res.status(400).json(err);
                        });
        });
    },
    savePoll:function(pollName,optionsArr){
        return new Promise(function(resolve,reject){
            var poll = new Poll();
            poll.name= pollName;
            poll.options = optionsArr.slice();
            poll.save(function(err,poll){
                if(err) {
                    reject(err);
                } else {
                    resolve(poll);
                }
            });
        });
    },
    saveOptions:function(options){
        var optsArr=[];
        var promises = options.map(function(opt){
            return new Promise(function(resolve, reject){
                  var option = new Option(opt);
                  return option.save(function(err,option){
                      if(err){
                          reject(Error(err));
                      } else {
                      resolve(optsArr.push(option));
                      }
                  });
            });
        });
        
        return Promise.all(promises).then(function(){
                return optsArr;
            }).catch(function (err) {
                console.log(err);
        });
    },
    
    getAllPolls: function(req,res) {
       
        User.findOne({ _id: req.params.user_id})
            .populate('polls')
            .exec(function(err, user){
                 if (err) return res.status(400).json(err);
                 res.json(user.polls);
        });
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
        // var id = req.body.id;
        
        User.findOne({
            _id: req.params.user_id
        }).select('password').exec(function(err, user) {
            // if (err) return res.status(400).json(err);
            if (err) return res.status(400).json(err);
            //If the user is not null
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
            } else {
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