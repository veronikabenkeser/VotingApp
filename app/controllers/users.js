var User = require('../models/user');

module.exports = {
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
                      return res.json({success: false, message : 'A user with that user name already exists.'});
                }
                else {
                    return res.send(err);
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
            if (err) res.json({error: 'User not found.'});
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
                if (err) return res.send(err);
                // res.json({
                //     message: 'Your account has been updated.'
                // });
                res.json(user);
            });

        });
    },
    deleteUser: function(req, res) {
        User.remove(req.params.user_id, function(err, user) {
            if (err) return res.send(err);
            res.json({
                message: 'Your account has been deleted.'
            });
        });
    }
};