//Require modules
const express = require('express');
const ejsLayouts =require('express-ejs-layouts');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'pollo1234'
  });
const app = express();
const port = process.env.PORT || 8080;

//Motor de vistas EJS
app.set('view engine','ejs');
app.use(ejsLayouts);

//uso del bodyParser
app.use(express.urlencoded({extended:true}));

//Cargar modulo de routes
const router= require('./routes/routes.js'); 
app.use('/',router);

//Recursos públicos
app.use(express.static('public'));

app.listen(port,() =>{
    console.log("Servidor activo en puerto: " + port);
} );
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });