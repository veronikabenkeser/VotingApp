var http = require('http');
var path = require("path");
var express = require('express');
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose  = require("mongoose");
var User = require("./app/models/user");
var Poll = require("./app/models/poll");
var jwt = require("jsonwebtoken");
// var superSecret = 'autumncatissingingmeowsongs';

var passport = require("passport");
var config = require("./config/server");
var superSecret = config.secret;

var app = express();
//App configuration
//body parser to grab info from POST requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Configuration to handle CORS reqs
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET','POST');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization')
  next();
  
});

//Connect to MongoDb
mongoose.connect("mongodb://"+process.env.IP+"/mydb");
// mongoose.connect(config.database);
//log all requests to the console
app.use(morgan('dev'));

//required for passport




//Routes for our API
//basic route for the homepage
//send our index.html file to the user for the home page
// app.get('/', function(req, res){
//   res.sendFile(path.join(__dirname+'/index.html'));
// });

app.use(express.static(__dirname+'/client'));

//Setup and automatically register all routes/ Could go the express. Router() and then app. user('/api',apiRouter) way.
// app.route('/login')
// //show the form (GET https://try4-autumncat.c9users.io/login)
//         .get(function(req,res){
//           // res.send('this is the login form');
//           res.json({message:'welcome to the login form!'});
//         })
        
//         //process the form (POST https://try4-autumncat.c9users.io/login)
//         .post(function(req,res){
//           console.log("processing the form");
//           // res.send("processing the login form");
//           res.json({message:'processing the login form!'});
//         });
        
        
       
//middleware to use for all of our requests


var apiRoutes = require("./app/routes/api")(app,express);

//Register our apiRoutes
app.use('/api',apiRoutes);

//After the user has been authenticated, send him to this frontend
//Main catchall route
//For all other routes (*), we will send the user to our frontend application where Angular can handle routing them from there.
// app.get('*',function(req,res){ //going to the link itself https://try4-autumncat.c9users.io
//   // res.sendFile();
//   console.log("this is happening.");
// });

// app.get('/',function(req,res){ //going to the link itself https://try4-autumncat.c9users.io
//   // res.sendFile();
//   console.log("this is happening.");
// });

//Start the server
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
 
  console.log("Server listening.. ");
});

