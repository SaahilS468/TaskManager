require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo');

//Database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

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

app.set('view engine', 'ejs');
mongoose.set("strictQuery", false);


//Models
const Task = require('./models/Task');
const User = require('./models/User');

//Routes

app.get('/register', (req,res) => {
    res.render("register")
})

app.post("/register", async (req,res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })
        await user.save()
        res.redirect("/login")
    } catch (err) {
        console.log(err);
        res.render("register");
    }
})

app.get('/login', (req,res) => {
    res.render("login")
})

app.post("/login", async (req,res) => {
    await User.findOne({username: req.body.username})
    .then((data) => {
        if(data.password === req.body.password){
            req.session.user = data;
            res.redirect("/home")
        }
        else{
            console.log("Incorrect Password");
            res.render("login")
        }
        
    })
    .catch((err) => {
        console.log(err);
        res.render("login");
    })
})


app.get('/home', (req,res) => {
    Task.find({ userId: req.session.user._id })
    .then((tasks) => {
        // console.log(tasks);
        res.render("index",{tasks: tasks});
    })
    .catch((err) => {
        console.error(err);
    })
});

app.post('/home', async (req,res) => {
    try{
        const task = new Task({
            userId: req.session.user._id,
            task: req.body.task,
            time: req.body.date
        })
        // console.log(task);
        await task.save()
        res.redirect("/home");
    }
    catch(err) {
        console.log(err);
    }
});

app.get('/edit/:id', (req,res) => {
    // console.log(req.params.id);
    res.render("edit");
});

app.post('/edit/:id', async (req,res) => {
    Task.findByIdAndUpdate({ _id: req.params.id }, {task: req.body.task})
    .then(() => {
        res.redirect("/home")
    })
    .catch(() => {
        res.render("edit")
    })
});

app.get("/delete/:id", async (req,res) => {
    await Task.findByIdAndDelete({ _id: req.params.id}).then(() => {
        console.log("Deleted Successfully");
        res.redirect("/home")
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
})

app.get("/logout", (req,res) => {
    req.session.destroy();
    console.log(req.session);
    res.redirect("/login")
})

app.listen(3000, () => console.log("Connected to port 3000"));