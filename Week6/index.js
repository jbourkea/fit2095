const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ejs = require('ejs');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan("common"));
app.listen(8080);

app.use(express.static('css'));
app.use(express.static('images'));

let url = 'mongodb://localhost:27017/2096w6';
mongoose.connect(url, function (err) {
    if (err) throw err;
});


app.get('/newdoctor', (req, res) => {
    res.render('newDoctor.html');
});

app.post('/newdoctor', (req,res) => {
    let {firstname, lastname, dateofbirth, state, suburb, street, unit, numpatients} = req.body;
    let newDoctor = new Doctor({
        _id:mongoose.Types.ObjectId(),
        firstName:firstname,
        lastName:lastname,
        dateOfBirth:new Date(dateofbirth),
        address : {
            state:state,
            suburb:suburb,
            street:street,
            unit:unit
        },
        numPatients:numpatients
    });
    newDoctor.save((err)=>{
        if(err) console.log(err);
        else console.log("Added Doctor");
        res.redirect('/alldoctors');
    })
});

app.get('/alldoctors', (req, res)=>{
    Doctor.find({}, (err, docs)=>{
        res.render('allDoctors.html', {db:docs});
    });
    
});

app.get('/newpatient', (req, res)=>{
    res.render('newPatient.html');
});

app.post('/newpatient', (req, res)=> {
    let {fullname, docid, age, dateofvisit, casedesc} = req.body;
    let newPatient = new Patient({
        fullName:fullname,
        doctorId: docid,
        age:age,
        dateOfVisit:new Date(dateofvisit),
        caseDescription:casedesc
    });

    newPatient.save((err)=>{
        if(err) throw err;
        else console.log("Patient added");
        Doctor.findById(newPatient.doctorId, (err, doc)=>{
            doc.numPatients++;
            doc.save((err)=>{
                if (err) throw err;
            });
        });
        console.log("incremented doctor count");
        res.redirect('/alldoctors');
    });
});

app.get('/allpatients', (req, res)=>{
    Patient.find({}).populate('doctorId').exec((err, data) => {
        console.log(data);
        res.render('allPatients.html', {db:data});
    })
});

app.get('/deletepatient', (req, res)=>{
    res.render('deletePatient.html');
})

app.post('/deletepatient', (req, res)=>{
    let {fullname} = req.body;
    Patient.deleteOne({fullName : fullname}, (err, data)=>{
        if(err) throw err;
        console.log("Deleted Patient if exists");
        res.redirect('/allpatients');
    })
});

app.get('/updatenumber', (req, res)=>{
    res.render('updateNumber.html');
});

app.post('/updatenumber', (req, res) =>{
    let {docid, newcount} = req.body;
    Doctor.findByIdAndUpdate(docid, {numPatients : newcount}, (err, data)=>{
        if(err) throw err;
        console.log("Updating Doctor numPatients");
        console.log(docid);
        res.redirect('/alldoctors');
    })
});

app.get('/', (req, res)=>{
    res.render('index.html');
});

