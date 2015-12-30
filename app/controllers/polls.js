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
    getById: function(req, res) {
        // Poll.findById(req.params.poll_id)
        // Poll.findOne({ _id:req.params.poll_id})
        //     .populate('options')
        //     .exec(function(err, poll){
        //          if (err) return res.status(400).json(err);
        //          res.json(poll);
        //         });
        
        Poll.findByFriendly(req.params.poll_id)
            .populate('options')
            .exec(function(err, poll){
                 if (err) return res.status(400).json(err);
                 res.json(poll);
                });
        
       
    },
   
    modifyPoll:function(req,res){
        
        var newOptionsArr = req.body.newOptionsArr;
        var voteNewOptionName = req.body.voteNewOptionName;
        var voteId = req.body.voteId;
        
         Poll.findByFriendly(req.params.poll_id, function(err, poll){
             if (err) return res.status(400).json(err);
         
        function saveOption(option,callback){
            option.save(function(err, option){
                if(err) return res.status(400).json(err);
                    poll.options.push(option);
                    callback();
                });
            }
            
            function createOption(opt, callback){
                 var option = new Option();
                option.text = opt;
                if(option.text === voteNewOptionName){
                    console.log('same name');
                    option.votes = 1;
                } else {
                    option.votes =0;
                }
                callback(option);
            }
            
            function recordNewOptions(newOptionsArr){
                console.log('new Options Arr');
                console.log(newOptionsArr);
                var count=0;
            
                newOptionsArr.forEach(function(opt){
                    createOption(opt, function(result){
                        saveOption(result, function(){
                            count++;
                            if(count === newOptionsArr.length){
                                poll.save(function(err, poll) {
                                    if (err) return res.status(500).json(err);
                                    // res.json(poll);
                                     Poll.findOne({ _id: poll._id})
                                        .populate('options')
                                        .exec(function(error, poll) {
                                            res.json(poll);
                                        });
                                });
                            }
                        });
                    });
                });
            }
            
            function voteForExistingOpt(voteId){
                //find an existing option with this id and add a vote
                for(var i=0; i<poll.options.length;i++){
                    if(parseInt(poll.options[i],10) === parseInt(voteId,10)){
                        //fetch this option and add a vote
                        Option.findById(voteId,function(err,option){
                            if (err) return res.status(400).json(err);
                            option.addVote();
                            option.save(function(err, option){
                                if(err) return res.status(400).json(err);
                                if(newOptionsArr){
                                    recordNewOptions(newOptionsArr);
                                } else {
                                    // res.json(poll);
                                    Poll.findOne({ _id: poll._id})
                                        .populate('options')
                                        .exec(function(error, poll) {
                                            res.json(poll);
                                        });
                                }
                            });
                        });
                        break;
                    }
                }
            }
            
        if(voteId){
            voteForExistingOpt(voteId);
        } else {
            recordNewOptions(newOptionsArr);
        }
    });
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