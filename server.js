require('dotenv').config({path: __dirname+"/config/.env"});
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const connect = require('./config/connect');
const app = express();

//Database
connect();

//Sessions
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60*60*1000 },
    store: mongoStore.create({mongoUrl: process.env.MONGO_URL})
}));

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.use("/", require("./routes/user"));
app.use("/:uid/home", require("./routes/main"));

app.set('view engine', 'ejs');

app.listen(3000, () => console.log("Connected to port 3000"));