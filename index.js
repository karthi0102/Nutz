const express= require('express')
const path=require("path")
const bcrypt=require("bcrypt")
const res = require('express/lib/response')
const app=express();
const ejsMate=require('ejs-mate')
const session = require('express-session');
const flash = require("connect-flash")
const passport =require("passport")
const User = require('./models/user')
const LocalStrategy=require('passport-local')
const mongoose=require("mongoose")
const Detail= require("./models/detail")
mongoose.connect('mongodb://localhost:27017/Nutz',{useNewUrlParser:true,useUnifiedTopology:true})
.then( () => {
    console.log("Connection open")
}).catch(err => {
    console.log("OOPS !! ERROR")
})
const sessionConfig = {
    
    secret:'secret',
    name:'Nutz',
    resave:false,
    saveUnitialized:true,
    cookie:{
        // httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*32*7,
        maxAge:1000*60*60*32*7,
    }
}
app.engine('ejs',ejsMate)
app.set("view engine",'ejs')
app.set('views',path.join(__dirname,'views'));
app.use(flash());
app.use(express.urlencoded({extended:true}));
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(session(sessionConfig))


app.get('/register',(req,res)=>{
    res.render('register')
})
app.post("/register",async(req,res)=>{
    const {email,username,password}=req.body;
   
    const user = new User({username,email})
    const newUser=await User.register(user,password);
    await newUser.save();
    console.log(newUser)
    res.send("succesfully registered");

})

app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/show',async(req,res)=>{
        const detail = await Detail.find();
        console.log(detail)
        res.send(detail)
})
app.get("/detail",(req,res)=>{
    res.render("detail")
})
app.post("/detail",async(req,res)=>{
    const detail = new Detail(req.body.json);
    detail.save();
    res.redirect("/show");
})
app.get('/reset',(req,res)=>{
    res.render("reset")
})
app.post('/reset',async(req,res)=>{
    const {username,password}=req.body;
    const salt=await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    const user= await User.findOneAndUpdate(username,{salt:salt,hash:hash});
    await user.save();
    res.send("reseted")

})
app.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    res.send("successfully loggedin")
})
app.listen(8080,()=>{
    console.log('Server is running on port 8080')
})