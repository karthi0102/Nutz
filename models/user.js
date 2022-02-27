const mongoose = require("mongoose")
const { use } = require("passport")
const {Schema}=mongoose
const passportLocalMongoose=require('passport-local-mongoose');
const userSchema = new Schema({
    email:String
})
userSchema.plugin(passportLocalMongoose)
module.exports=mongoose.model("User",userSchema)