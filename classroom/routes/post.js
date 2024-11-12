const express = require("express");
const router = express.Router();


//POST ROUTES

//INDEX
router.get("/", (req,res) =>{
    res.send("GET for show post");
});

//Show
router.get("/:id", (req,res) =>{
    res.send("GET for post id");
});

//POST 
router.post("/", (req,res) =>{
    res.send("POST for posts");
});

//DELETE 
router.delete("/", (req,res) =>{
    res.send("Delete for POSTS");
});


module.exports = router;