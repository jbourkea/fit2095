const mongoose = require('mongoose');

let patientSchema = new mongoose.Schema({
    fullName:{type:String, minlength:1},
    doctorId:{type:mongoose.Schema.Types.ObjectId, ref:"Doctor"},
    age:{type:Number, min:0, max:120},
    dateOfVisit:{type:Date, default:Date.now()},
    caseDescription:{type:String, minlength:10}
});

module.exports = mongoose.model("Patient", patientSchema);