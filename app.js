'use strict'

const express = require('express');
const bodyParser = require ('body-parser');
const path = require('path');

const app = express();
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

const users = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe' ,
    email: 'jiddddfi@gmail.com',
  },
  {
    id: 2,
    first_name: 'Bob',
    last_name: 'Doe' ,
    email: 'bbbddjifi@gmail.com',
  },
  {
    id: 3,
    first_name: 'Jill',
    last_name: 'Jackson' ,
    email: 'jjjjifi@gmail.com',
  },
]

app.get('/', function(req,res){
  const title = 'Customers';
  res.render('index', {
    title: 'Customers',
    users: users
  });
});

app.post('/users/add', function(req, res){
  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
}
console.log(newUser);
});

app.listen(3004, function(){
  console.log('Server started on Port 3004');
})
