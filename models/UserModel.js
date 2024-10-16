const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    ID_User: { type: Number, required: true, unique: true },
    username: { type: String, required: true  },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    address: { type: String },
    }, 
{ timestamps: true });


module.exports = mongoose.model('User',UserSchema);
