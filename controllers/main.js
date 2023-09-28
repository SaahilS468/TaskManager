const Task = require('../models/Task');

exports.getTasks = (req,res) => {
    Task.find({ userId: req.session.user._id })
    .then((tasks) => {
        res.render("index",{tasks: tasks});
    })
    .catch((err) => {
        console.error(err);
    })
};

exports.addTasks = async (req,res) => {
    try{
        const task = new Task({
            userId: req.session.user._id,
            task: req.body.task,
            time: req.body.date
        })
        await task.save()
        res.redirect(`/${req.session.user.username}/home`);
    }
    catch(err) {
        console.log(err);
    }
};

exports.geditTask = (req,res) => {
    res.render("edit");
};

exports.editTask = (req,res) => {
    Task.findByIdAndUpdate({ _id: req.params.tid }, {task: req.body.task})
    .then(() => {
        res.redirect(`/${req.session.user.username}/home`)
    })
    .catch(() => {
        res.render("edit")
    })
};

exports.delTask = (req,res) => {
    Task.findByIdAndDelete({ _id: req.params.tid}).then(() => {
        console.log("Deleted Successfully");
        res.redirect(`/${req.session.user.username}/home`)
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
};