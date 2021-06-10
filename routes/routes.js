//importar modulos
const { Console } = require('console');
const express = require('express');
const path = require('path');
//Creamos un objeto de router express
const router = express.Router();
//exportar nuestro modulo route
module.exports = router;


router.get('/',(req,res)=>{
    res.render('pages/home',{title:'home'});
});

router.get('/about',(req,res)=>{
    res.render('pages/about',{title:'about'});
});

router.get('/clase',(req,res)=>{
    var clase = {
        tipo :'video',
        matname:'estudio.mp4#t=10',
        matbck:'http://placekitten.com/600/350',
        mattitulo:'¿Que es una escuela?',
        texttitulo:'Este es un titulo',
        textcont:`Este es el contenido que contiene el 
        texto contenido por el contenedor del texto que 
        contiene texto para contener el texto descrito 
        por la actividad de texto para texto, si por 
        algún motivo contuviera algún otro tipo de 
        contenido que no fuese posiblemente no serviría 
        de nada.`,
        instrucciones:['Lee el texto','Ve el video']
    }
    if(clase.tipo == 'video'){
        clase.mattitulo = '&#127909; ' + clase.mattitulo;
    }
    console.log(clase);
    res.render('pages/multimedia',{title:'video', clase});
});

router.get('/actividad',(req,res)=>{
    res.render('pages/actividad',{title:'actividad'});
});

router.get('/clase2',(req,res)=>{
    res.render('pages/audio',{title:'audio'});
});