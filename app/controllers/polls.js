var Poll = require('../models/poll');

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
        var poll = new Poll(req.body);
        
        // poll.name = req.body.name;
        // poll.option1 = req.body.option1;
        // poll.option2 = req.body.option2;

        poll.save(function(err, data) {
            if (err) {
                //duplicate entry

                 return res.json({
                    success: false,
                    message: 'Poll was not saved.'
                });
            }

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