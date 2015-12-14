var Poll = require('../models/poll');
var Option= require("../models/option");

module.exports = {

    getAllPolls: function(req, res) {
        console.log(Poll.model);
        Poll.find(function(err, polls) {
            if (err) return res.send(err);

            //return all of the polls
            res.json(polls);

        });
    },
    addPoll: function(req, res) {
        console.log('request body'+req.body);
        // var poll = new Poll(req.body);
        
        console.log("IN ADD POLL");
        console.log("HERE IS WHAt was sent "+ req.body.name);
        console.log("HERE IS WHAt was sent "+ req.body.options);
        // poll.name = req.body.name;
        // poll.option1 = req.body.option1;
        // poll.option2 = req.body.option2;
        
        // var poll = new Poll();
        // poll.name = req.body.name;
        // poll.options = req.body.options;
        //!!!!!
        // var poll = new Poll();
        // poll.options=[];
        // poll.name = req.body.name;
        // req.body.options.forEach(function(opt){
        //     poll.options.push(new Option({opt}));
        // });
        // !!!!!!
        var poll = new Poll();
        poll.options=[];
        poll.name = req.body.name;
        req.body.options.forEach(function(opt){
            poll.options.push(opt);
        });
        
        // var poll = new Poll();
        // poll.options=[];
        // poll.name = req.body.name;
        // req.body.options.forEach(function(opt){
        //     poll.options.push(opt);
        // });
        
        console.log("HERE IS HTE OBJ options "+poll.options);
        poll.save(function(err, data) {
            if (err) {
                //duplicate entry
                 return res.json(err);
                //  return res.json({
                //     success: false,
                //     message: 'Poll was not saved.'
                // });
            }
            //   Poll.findById(data._id).populate('options')
            //               .exec(function(err,datai){
            //                   console.log(JSON.stringify(datai,null,'/t'));
            //                   res.json(datai);
            //               });

            res.json(data);
            //   res.json({message: 'New poll created!'});
        });
    },
    getById: function(req, res) {
        Poll.findById(req.params.poll_id, function(err, poll) {
            // if (err) return res.send(err);
            if (err) res.json({error: 'Poll not found.'});
            res.json(poll);

        });
    },
    modifyPoll:function(req,res){
            Poll.findById(req.params.poll_id, function(err, poll) {
             if (err) res.json({error: 'Poll not found.'});
             

            //     //update the option if it's not blank and doesnt already exist
            //     if (req.body.option) {
            //         if (poll.options.indexOf(req.body.option) === -1) {
            //             poll.options.push(req.body.option);

            //             //save the updated poll into the database
            //             poll.save(function(err) {
            //                 if (err) res.send(err);
            //                 res.json({
            //                     message: 'The poll has been updated!'
            //                 });
            //             });
            //         }
            //         else {
            //             res.json({
            //                 message: 'This option already exists.'
            //             });
            //         }
            //     }
            // });
            //   });
        })
    },
    deletePoll: function(req, res) {
        Poll.remove({
            _id: req.params.poll_id
        }, function(err, poll) {
            if (err) return res.send(err);
            res.json({
                message: 'This poll has been successfully deleted.'
            });
        });
    }
};