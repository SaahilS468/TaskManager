const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: [true, "Please enter a task"]
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', taskSchema);