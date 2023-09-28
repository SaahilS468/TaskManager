const User = require('../models/User');

exports.getReg = (req,res) => {
    res.render("register");
}

exports.addReg = async (req,res) => {
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
}

exports.getLog = (req,res) => {
    res.render("login")
}

exports.addLog = (req,res) => {
    User.findOne({username: req.body.username})
    .then((data) => {
        if(data.password === req.body.password){
            req.session.user = data;
            res.redirect(`/${data.username}/home`);
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
}

exports.logOut = (req,res) => {
    req.session.destroy();
    res.redirect("/login")
}