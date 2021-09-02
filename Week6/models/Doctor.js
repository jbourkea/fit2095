const mongoose = require('mongoose');

let docSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName : {type: String, required:true},
    lastName : {type: String},
    dateOfBirth : {type:Date},
    address : {
        state: {type: String, minLength:2, maxLength:3},
        suburb : {type:String},
        street : {type:String},
        unit : {type:String}
    },
    numPatients : {type : Number, min:0}
});

module.exports = mongoose.model('Doctor', docSchema);