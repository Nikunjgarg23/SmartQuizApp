import mongoose from 'mongoose';
 
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
    }
},{
    timestamps : true
});
const Teacher = new mongoose.model('Teacher',teacherSchema);
export default Teacher;