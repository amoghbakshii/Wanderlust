const express = require("express");
const app = express();
const users = require("./routes/user");
const posts = require("./routes/post");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOptions = {
  secret:"mysupersecretstring",
  resave:false,
  saveUnitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=> {
  res.locals.successMsg = req.flash("success");
  res.locals.errMsg = req.flash("success");
  next();
})

app.get("/register",(req,res)=>{
  let {name = "Anonymous"} = req.query;
  req.session.name = name;
  if(name === "Anonymous"){
    req.flash("error","user not registered")
  }else{
  req.flash('success',"user registered successfully");
  }

  res.redirect("/hello");
  
});

app.get("/hello",(req,res)=>{
  res.render("page.ejs",{name:req.session.name});
});

// app.get("/reqcount", (req,res)=>{
//   if(req.session.count){
//     req.session.count++;
//   }else{
//     req.session.count = 1;
//   }
//   res.send(`you sent a request  ${req.session.count} times`);
// });



app.get("/test",(req,res) => {
    res.send("test Successful");
  });


app.listen(3000,()=>{
    console.log("app is listening to port 3000");
});