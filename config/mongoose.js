require ('dotenv').config();

const url= process.env.MONGODB_URI;

const mongoose = require('mongoose');
let db;
const connectTomongo=async()=>{

    try{
        console.log(url);
        await mongoose.connect(url);
        //  db = mongoose.connection;
        // db.once('open',function(){
             console.log('Successfully started database');
        // });
    }
    catch{

        console.log('error',console.error.bind(console,'Error starting database'));
    }
}
// mongoose.connect('mongodb://127.0.0.1:27017/minor-proj-db');



//console.log('mongoose');
module.exports = connectTomongo;