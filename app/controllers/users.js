var User = require('../models/user');
var Poll = require("../models/poll");

module.exports = {
    getAllUsers: function(req, res) {
        console.log(User.model);
        User.find(function(err, users) {
            if (err) return res.send(err);

            //return all of the polls
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
                //duplicate entry
                if (err.code === 11000) {
                    // return res.json(err);
                    //   return res.json({success: false, message : 'A user with that user name already exists.'});
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

            // res.json({
            //     message: 'User created!'
            // });
            res.json(user);
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
    modifyUser: function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) return res.send(err);
            if (req.body.name) user.name = req.body.name;
            if (req.body.email) user.email = req.body.email;
            if (req.body.password) user.password = req.body.password;

            //save the changes!
            user.save(function(err, user) {
                // if (err) return res.send(err);
                if (err) return res.status(500).json({
                    error: 'Unable to save changes.'
                });
                // res.json({
                //     message: 'Your account has been updated.'
                // });
                res.json(user);
            });

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
    deleteAllPolls: function(req, res) {
        User.findById(req.params.user_id, function(err, user) {

            //remove all polls belonging to this user from the polls collection
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
    deletePoll:function(req,res){
           User.findById(req.params.user_id, function(err, user) {
               if(err) return res.status(400).json(err);
               var index = user.polls.indexOf(req.params.poll_id);
               if(index>=0){
                   user.polls.splice(index,1);
               }else{
                   return res.json({error: 'You do not have permission to delete this poll.'});
               }
               
               Poll.remove({_id: req.params.poll_id},function(err, user) {
                   if (err) return res.status(500).json(err);
                   res.json(user);
               });
           });
    }
};