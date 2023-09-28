const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.getReg = (req,res) => {
    res.render("register");
}

exports.addReg = async (req,res) => {
    try {
        const hashPass = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashPass
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

exports.addLog = async (req,res) => {
    User.findOne({username: req.body.username})
    .then((data) => {
        bcrypt.compare(req.body.password, data.password)
        .then((result) => {
            if(result){
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
        })   
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