const express = require('express');
const router = express.Router();
const {getTasks, addTasks, geditTask, editTask, delTask} = require("../controllers/main");

router.route("/").get(getTasks).post(addTasks);
router.route("/edit/:tid").get(geditTask).post(editTask);
router.route("/delete/:tid").get(delTask);

module.exports = router;