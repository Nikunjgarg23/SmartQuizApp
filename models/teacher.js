const mongoose = require('mongoose');
 
const teacherSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true
    },
    score:{
        type:Number,
        default:0,
    },
    role:{
        type:String,
        default:"student",
    }
},{
    timestamps : true
});
const Teacher = new mongoose.model('Teacher',teacherSchema);
module.exports = Teacher;