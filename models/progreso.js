const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    username:String,
    clases: [{
        id:String,
        curso:String,
        titulo : String,
        tipo : {type:String, enum:['video','audio','imagen','actividad']}
    }]
});

module.exports = mongoose.model('Progreso',ProgressSchema);