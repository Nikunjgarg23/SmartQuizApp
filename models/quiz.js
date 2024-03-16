var mongoose = require('mongoose')
var quizSchema = mongoose.Schema({
    quizname: {
        type: String,
        required: true
    },
    upload:{
        type: Boolean, default: false
    },
    owner: {
        type: String
    },
    owneremail: {
        type: String
    },
    batches: {
        type: [String], // Define an array of strings
        default: null, // Set the default value to null
    },
    time:{
        type: Number,
        default:15
    },
    end:{
        type: Boolean,
        default:false
    },
    attempted:{
        type:[String],
        default:null
    },
    iseval:{
        type:Boolean,
        default:false
    }
});
quizSchema.index({ quizname: 1 }, { unique: true });
const Quiz = mongoose.model('Quiz',quizSchema);
module.exports = Quiz;