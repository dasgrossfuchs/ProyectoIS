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
