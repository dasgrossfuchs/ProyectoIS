//Require modules
const express = require('express');
const ejsLayouts =require('express-ejs-layouts');
const mongoose = require('mongoose');
const config = require('./config');
const port = process.env.PORT || 8080;
const app = express();

//Motor de vistas EJS
app.set('view engine','ejs');
app.use(ejsLayouts);

//uso del bodyParser
app.use(express.urlencoded({extended:true}));

//Recursos públicos
app.use(express.static('public'));

mongoose.connect(config.db, config.urlParser, (err,res)=>{
  if(err){
      console.log(`Error al conectar en la BD ${err}`);
  }
  else  {
      console.log('Conexión a la BD exitosa');
      app.listen(config.port, ()=>{
          console.log(`Ejecutando en http://localhost:${config.port}`);
      });
  }
});

//Cargar modulo de routes
const router= require('./routes/routes.js'); 
app.use('/',router);

app.use((req,res)=>{
  res.status(404).render('pages/sprint1',{layout:'layoutB',title:'Sprint 1'});
});