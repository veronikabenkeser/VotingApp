var User = require('../models/user');
var superSecret = process.env.SECRET;
var jwt = require('jsonwebtoken');
var users = require("../controllers/users");
var polls = require("../controllers/polls");
var Option = require("../models/option");

//Passing app and express from the server.js file
module.exports = function(app, express) {
    var apiRouter = express.Router();
    apiRouter.route('/polls')
        .get(function(req, res) {
            polls.getAllPolls(req, res);
        });

    apiRouter.route('/polls/:poll_id')
        .get(function(req, res) {
            polls.getById(req, res);
        });

    apiRouter.route('/options/:option_id')
        .get(function(req, res) {
            Option.findById(req.params.option_id, function(err, option) {
                if (err) res.json({
                    error: 'Option not found.'
                });
                res.json(option);

            });
        });

    apiRouter.route('/users')
        .post(function(req, res) {
            users.addUser(req, res);
        })
        .get(function(req, res) {
            users.getAllUsers(req, res);
        });

    apiRouter.route('/polls/:poll_id')
        .put(function(req, res) {
            polls.modifyPoll(req, res)
        });

    apiRouter.post('/authenticate', function(req, res) {
        User.findOne({
            email: req.body.email
        }).select('name email password').exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            }
            else {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    return res.status(400).json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                }
                else {
                    var token = jwt.sign({
                        name: user.name,
                        email: user.email,
                        _id: user._id
                    }, superSecret, {
                        expiresIn: 1440
                    });

                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token,
                        _id: user._id
                    });
                }
            }
        })
    });

    apiRouter.use(function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token || !token) {
            jwt.verify(token, superSecret, function(err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                }
                else {
                    //If the token is valid and hasnt expired, save this token to the request
                    //for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
    });

    apiRouter.route('/users/:user_id')
        .get(function(req, res) {
            users.getById(req, res);
        })
        .put(function(req, res) {
            users.changeSettings(req, res);
        })
        .delete(function(req, res) {
            users.deleteUser(req, res);
        });

    apiRouter.route('/users/:user_id/polls')
        .post(function(req, res) {
            users.addPoll(req, res);
        })
        .get(function(req, res) {
            users.getAllPolls(req, res);
        });

    apiRouter.route('/users/:user_id/polls/:poll_id')
        .delete(function(req, res) {
            users.deletePoll(req, res);
        });
    return apiRouter;
};
