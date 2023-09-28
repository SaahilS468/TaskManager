const express = require('express');
const router = express.Router();
const {getReg, addReg, getLog, addLog, logOut} = require("../controllers/user");

router.route("/").get((req,res) => {
    res.redirect("/register")
})

router.route("/register").get(getReg).post(addReg);
router.route("/login").get(getLog).post(addLog);
router.route("/logout").get(logOut);

module.exports = router;