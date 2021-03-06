var Poll = require('../models/poll');
var Option= require("../models/option");
var User = require("../models/user");

module.exports = {
    getAllPolls: function(req, res) {
        Poll.find(function(err, polls) {
            if (err) return res.send(err);

            res.json(polls);

        });
    },
    getById: function(req, res) {
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
        var voter = req.body.voter;
        
         Poll.findById(req.params.poll_id, function(err, poll){
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
                    option.votes = 1;
                } else {
                    option.votes =0;
                }
                callback(option);
            }
            
            function recordNewOptions(newOptionsArr){
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
                for(var i=0; i<poll.options.length;i++){
                    if(parseInt(poll.options[i],10) === parseInt(voteId,10)){
        
                        Option.findById(voteId,function(err,option){
                            if (err) return res.status(400).json(err);
                            option.addVote();
                            option.save(function(err, option){
                                if(err) return res.status(400).json(err);
                                if(newOptionsArr){
                                    recordNewOptions(newOptionsArr);
                                } else {
                                   
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
            
        function recordVote(){
             if(voteId){
                voteForExistingOpt(voteId);
            } else {
                recordNewOptions(newOptionsArr);
            }
        }
        
        if(voter){
             User.findById(voter, function(err, user){
            if (err) return res.status(400).json(err);
            if(user.registeredVotes.indexOf(req.params.poll_id) === -1){
                user.registeredVotes.push(req.params.poll_id);
                user.save(function(err, user){
                    if(err) return res.status(400).json(err);
                    recordVote();
                });
            } else {
                return res.status(400).json({
                    message: 'You have already voted in this poll'
                });
            }
       });
        }else{
             recordVote();
        }
    });
    }
};