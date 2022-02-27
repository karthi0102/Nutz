const mongoose = require("mongoose")
const {Schema} = mongoose

const jsonSchema = new Schema({
    name:String,
    age:Number,
    street:String,
    city:String,
    pincode:String,
    dob:String,
});

module.exports=mongoose.model("Detail",jsonSchema);