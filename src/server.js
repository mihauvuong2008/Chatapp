var express = require('express');
var app = express();
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').config('./.env')
var exphbs = require ('express-handlebars')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var path = require('path');

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport

app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret

app.use(passport.initialize());//

app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set("view engine", "hbs");
app.set("views", "./dist/views");

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "./dist/views"
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
  // tslint:disable-next-line:no-console
// console.log(path.join(__dirname, 'public')); coppy to dist!
app.use(express.static('public'));

//Routes by passport for login
var authRoute = require('./routes/auth.js');
authRoute(app, passport);

// Cho phép các api của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json());

//load database Models
const models = require("./models");
//Sync Database
models.sequelize.sync().then(function() {
  // tslint:disable-next-line:no-console
  console.log('Nice! Database looks fine')
}).catch(function(err) {
  // tslint:disable-next-line:no-console
  console.log(err, "Something went wrong with the Database Update!")

});

// setup token list
// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList = {};
const tokenauthcontroller = require("./controllers/tokenauthcontroller");
tokenauthcontroller.tokenList = tokenList;
tokenauthcontroller.setupDatabase(models);
//chatController :
const chatController = require("./controllers/chatController");
chatController.Database = models;// setup chatcontroller
chatController.setupDatabase(models);
// routes by jwt for chat
const chatAPI = require('./routes/chatAPI.js');
chatAPI(app, tokenauthcontroller, chatController);// setup chat router

//load passport strategies
const pssprt = require('./config/passport/passport.js');
  // tslint:disable-next-line:no-console
console.log( "models.user:",  models.users);//
pssprt(passport, models.users);// setup user

module.exports = app;
