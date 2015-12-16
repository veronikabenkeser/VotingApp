var User = require('../models/user');
var config = require('../../config/server');
var superSecret = config.secret;
var jwt = require('jsonwebtoken');

var Poll = require("../models/poll");
var users = require("../controllers/users");
var polls = require("../controllers/polls");
var Option = require("../models/option");

//Passing app and express from the server.js file
module.exports = function(app, express) {
    var apiRouter = express.Router();
    apiRouter.route('/polls')
        .get(function(req, res) {
            polls.getAllPolls(req, res);
        })
        .post(function(req, res) {
            console.log("PRE REQ "+ req.body)
            polls.addPoll(req, res);
        });


apiRouter.route('/options/:option_id')
        .get(function(req,res){
            Option.findById(req.params.option_id, function(err, option) {
            // if (err) return res.send(err);
            if (err) res.json({error: 'Option not found.'});
            res.json(option);

        });
        });
        
    apiRouter.route('/polls/:poll_id')
        .get(function(req, res) {
            polls.getById(req, res);
        })
        .post(function(req, res) {
            polls.modifyPoll(req, res);
        })
        .delete(function(req, res) {
            polls.deletePoll(req, res);
        });

    apiRouter.route('/users')
        .post(function(req, res) {
            users.addUser(req, res);
        })
        .get(function(req, res) {
            users.getAllUsers(req, res);
        });

    //Authenticating Users
    apiRouter.post('/authenticate', function(req, res) {
        // apiRouter.post('/login',function(req,res){
        //find the user
        //select the name,email, and password explicitly
        User.findOne({
            email: req.body.email
        }).select('name email password').exec(function(err, user) {
            if (err) throw err;

            //no user with that email found
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            }
            else {
                //if email is found, check if the password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    return res.status(400).json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                }
                else {
                    //Create a token
                    var token = jwt.sign({
                        //payload - info we want to transmit back to the website every time the user visits
                        name: user.name,
                        email: user.email,
                        _id: user._id
                            //The secret is the signature held by the server.
                    }, superSecret, {
                        // expiresIn: 1440
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

    //Route middleware to verify a token
    //Since the pathh is omitted here. the path is "/" by default. This middleware will
    //be fired every time the user is at ../api..
    //Users are required to have a token to access apiRouter's endpoints(/api/...)
    //-- api USer tOKEN

    apiRouter.use(function(req, res, next) {

        console.log("CHECK");

        //Check post params,url params,  or header params for token

        //URL parameters are what follows '?'' here:
        //http://example.com/api/users?id=4&token=sdfa3&geo=us
        //URL Parameters are grabbed using req.param.variable_name


        //POSTparams are params from forms,which  pass information as application/x-www-form-urlencoded.
        //POST Parameters are grabbed using req.body.variable_name
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        //decode token
        if (token || !token) {
            //verifies secret and checks token's expiration
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
            //if there is no token
            //return an HTTP response of 403 (access forbidden) and an error message
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
    });

    //View, update or delete an existing user account
    apiRouter.route('/users/:user_id')
        .get(function(req, res) {
            users.getById(req, res);
        })
        .put(function(req,res){
             users.changeSettings(req,res);
        })
        .delete(function(req, res) {
            users.deleteUser(req, res);
        });

    //As an authenticated user, I can create a poll or delete one of my polls
    apiRouter.route('/users/:user_id/polls')
        .post(function(req, res) {
            users.addPoll(req, res);
        })
        .delete(function(req, res) {
            users.deleteAllPolls(req, res);
        })
        .get(function(req,res){
            users.getAllPolls(req,res);
        });

    apiRouter.route('/users/:user_id/polls/:poll_id')
        .delete(function(req, res) {
            users.deletePoll(req, res);
        });
        
    return apiRouter;
};
