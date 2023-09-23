var mongoose = require('mongoose')
var quizSchema = mongoose.Schema({
    quizname: {
        type: String,
        required: true
    },
    quizdescription: {
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
    }
});
const Quiz = mongoose.model('Quiz',quizSchema);
module.exports = Quiz;