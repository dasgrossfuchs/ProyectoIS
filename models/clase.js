const mongoose = require('mongoose');

const ClaseSchema = new mongoose.Schema({
    curso:{type:String, enum : ['esp','mat']},
    titulo : String,
    texto : String, 
    tipo:{type:String, enum:['video','audio','imagen','actividad']},
    matname:String,
    material:String,
    bckupMat:String,
    inst:[{type:String}]
});

module.exports = mongoose.model('Clase',ClaseSchema);