const mongoose = require('mongoose');

const AlumnoSchema =new mongoose.Schema({
    nombre:String,
    username:{type:String,unique:true,lowercase:true},
    password:String,
});

module.exports = mongoose.model('Alumno',AlumnoSchema);