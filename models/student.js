const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    Enroll: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const Student = new mongoose.model('Student', studentSchema);
module.exports = Student;