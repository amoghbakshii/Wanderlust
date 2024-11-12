const express = require("express");
const router = express.Router();


//INDEX- users
router.get("/", (req,res) =>{
    res.send("GET for show users");
});

//Show-users
router.get("/:id", (req,res) =>{
    res.send("GET for show users");
});

//POST users
router.post("/", (req,res) =>{
    res.send("POST for show users");
});

//DELETE USERS
router.delete("/:id", (req,res) =>{
    res.send("POST for show users");
});


module.exports = router;