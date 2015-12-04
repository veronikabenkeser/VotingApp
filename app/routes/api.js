var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config/server');
var Poll = require("../models/poll");

var superSecret = config.secret;
//passing app and express from the server.js file
module.exports = function(app,express){
    var apiRouter = express.Router();
    
    
   apiRouter.route('/polls')
   .get(function(req,res){
     Poll.find(function(err,polls){
       if(err) res.send(err);
       
       //return all of the polls
       res.json(polls);
     });
   })
   .post(function(req,res){
       var poll = new Poll();
       poll.name = req.body.name;
       poll.option1 = req.body.option1;
       poll.option2 = req.body.option2;
       
        //save the poll and check for errors
     poll.save(function(err,data){
       if (err) {
         //duplicate entry
        
           return res.json({success: false, message : 'Poll was not saved.'});
       }
        
       res.json(data);
    //   res.json({message: 'New poll created!'});
     });
   });
  
apiRouter.route('/polls/:poll_id')
   //get the poll with that id
   //accessed via GET ....polls/:poll_id
   .get(function(req, res) {
       Poll.findById(req.params.poll_id,function(err, poll){
         if(err) res.send(err);
       
         res.json(poll);
         
       });
   })
   //update the options of this poll
   //accessed via PUT .../api/polls/:poll_id
   .put(function(req,res){
     Poll.findById(req.params.poll_id,function(err, poll) {
         if(err) res.send(err);
         
         //update the option if it's not blank and doesnt already exist
         if(req.body.option){
           if(poll.options.indexOf(req.body.option) ===-1){
           poll.options.push(req.body.option);
           
           //save the updated poll into the database
           poll.save(function(err){
             if(err) res.send(err);
             res.json({message:'The poll has been updated!'});
           });
         } else {
           res.json({message: 'This option already exists.'});
         }
         }
     });
//   });
})
.delete(function(req, res) {
          Poll.remove({
            _id: req.params.poll_id
          }, function(err, poll){
            if(err) return res.send(err);
            res.json({message: 'This poll has been successfully deleted.'});
          });
      });  
   
    
    //Get all users and create a new account
apiRouter.route('/users')
    .get(function(req, res) {
          User.find(function(err,users){
            if(err) return res.send(err);
            res.json(users);
          });
    })

   //create a new user (accessed at POST at ..../api/users)
   .post(function(req,res){
     //create a new instance of the User model
     var user = new User();
     
     //set the users info(comes from the req)
     user.name = req.body.name;
     user.email = req.body.email;
     user.password = req.body.password;
     
     //save the user and check for errors
     user.save(function(err){
       if (err) {
         //duplicate entry
         if(err.code === 11000){
               return res.json(err);
        //   return res.json({success: false, message : 'A user with that user name already exists.'});
         } else {
           return res.send(err);
         }
       } 
       
       res.json({message: 'User created!'});
     });
   });
   
    //Authenticating Users
apiRouter.post('/authenticate',function(req,res){
  //find the user
  //select the name,email, and password explicitly
  User.findOne({
    email: req.body.email
  }).select('name email password').exec(function(err,user){
    if(err)throw err;
    
    //no user with that email found
    if(!user){
      res.json({
        success: false,
        message:'Authentication failed. User not found.'
      });
    } else {
      //if email is found, check if the password matches
      var validPassword = user.comparePassword(req.body.password);
      if(!validPassword){
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        //Create a token
        var token = jwt.sign({
          //payload - info we want to transmit back to the website every time the user visits
          name: user.name,
          email: user.email
          //The secret is the signature held by the server.
        }, superSecret, {
          expiresInMinutes: 1440
        });
        
        res.json({
          success: true,
          message : 'Enjoy your token!',
          token: token
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

apiRouter.use(function(req,res,next){
  //Check post params,url params,  or header params for token
  
  //URL parameters are what follows '?'' here:
  //http://example.com/api/users?id=4&token=sdfa3&geo=us
  //URL Parameters are grabbed using req.param.variable_name
  
  
  //POSTparams are params from forms,which  pass information as application/x-www-form-urlencoded.
   //POST Parameters are grabbed using req.body.variable_name
var token=req.body.token||req.query.token||req.headers['x-access-token'];
  
  //decode token
if(token || !token){
    //verifies secret and checks token's expiration
    jwt.verify(token, superSecret, function(err,decoded){
      if(err){
        return res.status(403).send({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        //If the token is valid and hasnt expired, save this token to the request
        //for use in other routes
        req.decoded =decoded;
        next();
      }
    });
  } else {
    //if there is no tocken
    //return an HTTP response of 403 (access forbidden) and an error message
   return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
});

apiRouter.get('/',function(req,res){
  res.json({message: 'hooray! welcome to our api, '+req.params.name});
});



  


//View, update or delete an existing user account
apiRouter.route('/users/:user_id')
   .get(function(req, res){
     User.findById(req.params.user_id,function(err,user){
       if(err) return res.send(err);
      res.json(user);
     });
   })
   .put(function(req,res){
     User.findById(req.params.user_id,function(err, user) {
         if(err) return res.send(err);
         if(req.body.name) user.name=req.body.name;
         if(req.body.email) user.email= req.body.email;
         if(req.body.password) user.password = req.body.password;
         
         //save the changes!
         user.save(function(err,user){
           if(err) return res.send(err);
            res.json({message: 'Your account has been updated.'});
         });
        
     });
   })
   .delete(function(req,res){
     User.remove(req.params.user_id,function(err,user){
       if(err) return res.send(err);
       res.json({message: 'Your account has been deleted.'});
     });
   });

//As an authenticated user, I can create a poll , edit a poll, or delete one of my polls
apiRouter.route('/mypolls')
//accessed via GET ....api/mypolls

//get this user's polls ??
    .get(function(req,res){
      Poll.find(function(err,polls){
       if(err) return res.send(err);
       
       //return all of the polls
       res.json(polls);
     });
    })
    
    .post(function(req,res){
      var poll = new Poll();
      
      //set poll info (comes from the req)
      poll.name = req.body.name;
      poll.option1 = req.body.option1;
      poll.option2 = req.body.option2;
      
      poll.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message: 'New poll created!'});
      });
    })
    
    //accessed at DELETE ..../mypolls
    .delete(function(req,res){
      Poll.remove(function(err){
        if(err) return res.send(err);
        res.json({message: 'removed all the polls from the collection.'});
      });
    });
    
  apiRouter.route('/mypolls/:poll_id')
    
      .get(function(req, res) {
          Poll.findById(req.params.poll_id, function(err, poll) {
              if(err) return res.send(err);
              res.json(poll);
              });
              
          });
      
    //   .delete(function(req, res) {
    //       Poll.remove({
    //         _id: req.params.poll_id
    //       }, function(err, poll){
    //         if(err) return res.send(err);
    //         res.json({message: 'This poll has been successfully deleted.'});
    //       });
    //   });  

apiRouter.get('/me',function(req, res) {
  //autherization token stored in req.decoded
   res.send(req.decoded);
   //dont need an error message because if the user has no active token,
   //then the request wont even get to this point because it wont get through the 
   //authorization middleware
});

return apiRouter;
};