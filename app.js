'use strict'

const express = require('express');
const bodyParser = require ('body-parser');
const path = require('path');

const mongojs = require('mongojs');
const db = mongojs('Users-Project', ['users']);
const ObjectId = mongojs.ObjectId;
const app = express();

const expressValidator = require('express-validator');


/*const logger = function(req, res, next){
  console.log('loging...');
  next();
}
app.use(logger);
*/

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static path
app.use(express.static(path.join(__dirname, 'public')));

// Global Vars
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/', function(req,res){
    db.users.find(function (err, docs) {
      console.log(docs);
        res.render('index', {
          title: 'Customers',
          users: docs
        });
    });
});

app.post('/users/add', function(req, res){
    //req.checkBody('users', 'Users must be an array').isArray();
    req.checkBody('first_name', 'First name is Required').notEmpty();
    req.checkBody('last_name', 'Last name is Required').notEmpty();
    req.checkBody('email', 'email is Required').notEmpty();

    var errors = req.validationErrors();
    var users = [];
    if(errors){
      //console.log('ERRORS');
      res.render('index', {
          title: 'Customers',
          users: users,
          errors: errors
        });

    } else {
      //console.log('SUCCESS');
        var newUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email
        }

        db.users.insert(newUser, function(err, result){
          if(err){
            console.log(err);
            res.render('index', {
                title: 'Customers',
                users: users,
                errors: errors
              });
          }
          res.redirect('/');
        });
    }
});

app.delete('/users/delete/:id', function(req, res){
  //console.log(req.params.id);
  db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  })

});

app.listen(3004, function(){
  console.log('Server started on Port 3004');
})
