const mongoose = require('mongoose');
const Alumno = require('../models/alumno');
const Clase = require('../models/clase');
const Progreso = require('../models/progreso');
const Classlist = 
    {esp:{video:[],
    audio:[],
    imagen:[],
    actividad:[]},
    mate:{video:[],
    audio:[],
    imagen:[],
    actividad:[]}};
// const Classlisting = mongoose.model('Classlisting',Classlist);

module.exports={
    'getClassList' : getClassList
}
function getClassList(){
    var clist = {esp:{video:[], audio:[], imagen:[], act:[]},
        mate:{video:[], audio:[], imagen:[], act:[]}};
    Clase.find({},(err,resultado)=>{
        if(err) return res.status(500).send({
            message:`Error al realizar la petición : ${err}`
        });
        if(!resultado) return res.status(404).send({
            message: 'No existen resultados'
        })
        resultado.forEach(element => {
            let newel = {id:element._id,titulo:element.titulo};
            if (element.curso == 'esp') {
                if (element.tipo=='video') {
                    clist.esp.video.push(newel);
                }
                if (element.tipo=='audio') {
                    clist.esp.audio.push(newel);
                }
                if (element.tipo=='imagen') {
                    clist.esp.imagen.push(newel);
                }
                if (element.tipo=='actividad') {
                    clist.esp.act.push(newel);
                }
            }
            if (element.curso == 'mat') {
                if (element.tipo=='video') {
                    clist.mate.video.push(newel);
                }
                if (element.tipo=='audio') {
                    clist.mate.audio.push(newel);
                }
                if (element.tipo=='imagen') {
                    clist.mate.imagen.push(newel);
                }
                if (element.tipo=='actividad') {
                    clist.mate.act.push(newel);
                }
            }
        });
    }).lean();
    return  clist;
}




