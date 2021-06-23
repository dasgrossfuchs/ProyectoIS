//importar módulos
const mongoose = require('mongoose');
const {
    Console
} = require('console');
const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const {
    request
} = require('https');
const path = require('path');
const router = express.Router();
const Alumno = require('../models/alumno');
const Clase = require('../models/clase');
const Progreso = require('../models/progreso');
var mFunc = require('./monfunctions');
var clist = mFunc.getClassList();
module.exports = router;
router.use(expressLayouts);

// rutas

///LOGIN
router.get('/', (req, res) => {
    if (res.statusCode != 404) {
        res.render('pages/login', {
            layout: 'layoutB',
            title: 'Inicio de sesión',
            error: 'nada'
        });
    } else {
        res.render('pages/login', {
            layout: 'layoutB',
            title: 'Inicio de sesión',
            error: 'uspwd'
        });
    }

});

router.post('/', (req, res) => {
    // var user=(req.body.usr).toLowerCase();
    // var pass=(req.body.pwd);
    // Alumno.findOne({username:user},(err,alumno)=>{
    //     if(err) {
    //         return res.status(500).send({
    //         message:`Error al realizar la petición : ${err}`
    //     });
    //     }
    //     else if(!alumno){ //Si no existe el usuario
    //         res.render('pages/login',{layout:'layoutB' ,title:'Inicio de sesión', error:'uspwd'});
    //     } else if(alumno.password != pass){//Si no es la misma contraseña 
    //         res.render('pages/login',{layout:'layoutB' ,title:'Inicio de sesión', error:'uspwd'});
    //     } else if(alumno.password == pass){
    //         // res.redirect('/dashboard',{usr:user});
    //         const url = require('url'); 
    //         res.redirect(url.format({pathname:"/dashboard",query:{usr:user}}));
    //         // res.render('pages/dash',{layout:'layoutB' ,title:'Clases', error:''});
    //         return;
    //     }
    // }).lean();
    res.render('pages/login', {
        layout: 'layoutB',
        title: 'Inicio de sesión',
        error: 'uspwd'
    });
});
//REGISTRO
router.get('/registrar', (req, res) => {
    res.render('pages/reg', {
        layout: 'layoutB',
        title: 'Crear una cuenta',
        error: 'nada'
    });
});
router.post('/registrar', (req, res) => {
    var name = (req.body.name);
    var user = (req.body.usr).toLowerCase();
    var pass = (req.body.pwd);
    Alumno.findOne({
        username: user
    }, (err, alumno) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!alumno) {
            let nvoAlumno = new Alumno();
            nvoAlumno.nombre = name;
            nvoAlumno.username = user;
            nvoAlumno.password = pass;
            nvoAlumno.save((err, registro) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición : ${err}`
                });
                // res.redirect('/dashboard',{usr:user});
                res.render('pages/login', {
                    layout: 'layoutB',
                    title: 'Inicio de sesión',
                    error: 'registrado'
                });
            });
        } else {
            res.render('pages/reg', {
                layout: 'layoutB',
                title: 'Inicio de sesión',
                error: 'userexist'
            });
        }
    }).lean();

    //res.render('pages/reg',{layout:'layoutB' ,title:'Crear una cuenta', error:'nada'
});

router.get('/bandeja', (req, res) => {
    res.redirect('/');
});

router.post('/bandeja/clases', dashMid, getMyDash);
router.post('/bandeja', loginReq, getMyDash);
router.post('/bandeja/done', updProgreso, getMyDash);
router.post('/clase/imagen', getClassImg);
router.post('/clase/video', getClassVid);
router.post('/clase/audio', getClassAud);
router.post('/clase/actividad', getClassAct);
//MiddleWAREs
function loginReq(req, res, next) {
    var user = (req.body.usr).toLowerCase();
    req.user = user;
    var pass = (req.body.pwd);
    Alumno.findOne({
        username: user
    }, (err, alumno) => {
        if (err) {
            res.redirect('/');
        } else if (!alumno) { //Si no existe el usuario
            res.redirect('/');
        } else if (alumno.password != pass) { //Si no es la misma contraseña 
            res.redirect('/');
        } else if (alumno.password == pass) {
            req.name = alumno.nombre;
            return next();
        } else {
            res.redirect('/');
        }
    }).lean();
}

function getMyDash(req, res) {
    var user = req.user;
    var name = req.name;
    let clist = {
        esp: [],
        mate: []
    };
    let proglist = {
        esp: [],
        mate: []
    };
    let finlist = {
        esp: [],
        mate: []
    };
    Clase.find({}, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado || !resultado[0]) {
            res.render('pages/dash', {
                layout: 'layoutC',
                title: 'Tus Clases',
                pend: clist,
                done: proglist,
                username: user,
                nombre: name
            });
        } else {
            resultado.forEach(element => {
                let newel = {
                    id: element._id.toString(),
                    titulo: element.titulo,
                    tipo: element.tipo,
                    curso: element.curso
                };
                if (element.curso == 'esp') clist.esp.push(newel);
                if (element.curso == 'mat') clist.mate.push(newel);
            });
            Progreso.find({
                username: user
            }, (err, petres) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición : ${err}`
                });
                if (!petres || !(petres.length != 0) || !petres[0]) {
                    res.render('pages/dash', {
                        layout: 'layoutC',
                        title: 'Mis Clases',
                        pend: clist,
                        done: proglist,
                        username: user,
                        nombre: name
                    });
                } else {
                    petres[0].clases.forEach(element => {
                        let newel = {
                            id: element.id,
                            titulo: element.titulo,
                            tipo: element.tipo,
                            curso: element.curso
                        };
                        if (element.curso == 'esp') proglist.esp.push(newel);
                        if (element.curso == 'mat') proglist.mate.push(newel);
                    });
                    if (proglist.esp.length != 0) {
                        clist.esp.forEach(element => {
                            let nohecho = true;
                            proglist.esp.forEach(progelement => {
                                if (element.id == progelement.id) {
                                    nohecho = false;
                                }
                            });
                            if (nohecho) {
                                let newel = {
                                    id: element.id,
                                    titulo: element.titulo,
                                    tipo: element.tipo,
                                    curso: element.curso
                                };
                                finlist.esp.push(newel);
                            }
                        });
                    } else {
                        finlist.esp = clist.esp;
                    }
                    if (proglist.mate.length != 0) {
                        clist.mate.forEach(element => {
                            let nohecho = true;
                            proglist.mate.forEach(progelement => {
                                if (element.id == progelement.id) {
                                    nohecho = false;
                                }
                            });
                            if (nohecho) {
                                let newel = {
                                    id: element.id,
                                    titulo: element.titulo,
                                    tipo: element.tipo,
                                    curso: element.curso
                                };
                                finlist.mate.push(newel);
                            }
                        });
                    } else {
                        finlist.mate = clist.mate;
                    }
                    res.render('pages/dash', {
                        layout: 'layoutC',
                        title: 'Tus Clases',
                        pend: finlist,
                        done: proglist,
                        username: user,
                        nombre: name
                    });
                }
            }).lean();
        }
    }).lean();
}

function getClassImg(req, res) {
    var user = req.body.user;
    var name = req.body.name;
    var classId = req.body.classId;
    Clase.find({
        _id: classId
    }, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado[0]) {
            res.redirect('/');
        } else {
            let titulo = 'Clase - ' + resultado[0].titulo;
            res.render('pages/claseImagen', {
                title: titulo,
                username: user,
                classId: classId,
                clase: resultado[0],
                nombre: name
            });
        }
    }).lean();
}

function getClassVid(req, res) {
    var user = req.body.user;
    var name = req.body.name;
    var classId = req.body.classId;
    Clase.find({
        _id: classId
    }, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado[0]) {
            res.redirect('/');
        } else {
            let titulo = 'Clase - ' + resultado[0].titulo;
            res.render('pages/claseVideo', {
                title: titulo,
                username: user,
                classId: classId,
                clase: resultado[0],
                nombre: name
            });
        }
    }).lean();
}

function getClassAud(req, res) {
    var user = req.body.user;
    var name = req.body.name;
    var classId = req.body.classId;
    Clase.find({
        _id: classId
    }, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado[0]) {
            res.redirect('/');
        } else {
            let titulo = 'Clase - ' + resultado[0].titulo;
            res.render('pages/claseAudio', {
                title: titulo,
                username: user,
                classId: classId,
                clase: resultado[0],
                nombre: name
            });
        }
    }).lean();
}

function getClassAct(req, res) {
    var user = req.body.user;
    var name = req.body.name;
    var classId = req.body.classId;
    Clase.find({
        _id: classId
    }, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado[0]) {
            res.redirect('/');
        } else {
            // console.log(resultado);
            let titulo = 'Clase - ' + resultado[0].titulo;
            if (resultado[0].texto == 'suma')
                res.render('pages/claseAct', {
                    title: titulo,
                    username: user,
                    classId: classId,
                    clase: resultado[0],
                    nombre: name
                });
            if (resultado[0].texto == 'resta')
                res.render('pages/claseAct2', {
                    title: titulo,
                    username: user,
                    classId: classId,
                    clase: resultado[0],
                    nombre: name
                });
            if (resultado[0].texto == 'comb' || resultado[0].texto == 'combinado')
                res.render('pages/claseAct3', {
                    title: titulo,
                    username: user,
                    classId: classId,
                    clase: resultado[0],
                    nombre: name
                });

        }
    }).lean();
}

function updProgreso(req, res, next) {
    var user = (req.body.usr).toLowerCase();
    req.user = user;
    var name = req.body.name;
    req.name = name;
    var clasehecha = {
        id: req.body.classId,
        curso: req.body.curso,
        titulo: req.body.titulo,
        tipo: req.body.tipo
    };
    Progreso.find({
        username: user
    }, (err, result) => {
        if (err) {
            res.redirect('/');
        } else if (!result[0]) {
            let prog = new Progreso();
            prog.username = user;
            prog.clases.push(clasehecha);
            prog.save((err, savedresult) => {
                if (err) {
                    res.redirect('/');
                } else {
                    next();
                }
            });
        } else {
            var existe = false;
            for (let i = 0; i < result[0].clases.length; i++) {
                if (result[0].clases[i].id == req.body.classId) {
                    existe = true;
                }
            }
            if (existe) {
                next();
            } else {
                Progreso.findOneAndUpdate({
                    username: user
                }, {
                    $push: {
                        clases: clasehecha
                    }
                }, (err, resultado) => {
                    if (err) {
                        res.redirect('/');
                        // console.log(resultado);
                    } else if (!resultado) {
                        // console.log(!resultado);
                        res.redirect('/');
                    } else {
                        next();
                    }
                }).lean();
            }
        }
    }).lean();
}

function dashMid(req, res, next) {
    var user = (req.body.user).toLowerCase();
    req.user = user;
    var name = req.body.name;
    req.name = name;
    next();
}

//Enrutamiento de Herramientas Administrativas
router.get('/deleteplz', (req, res) => {
    Progreso.remove({}, (err) => {});
    res.redirect('/');
});

router.get('/api/alumnos', (req, res) => {
    Alumno.find({}, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado) return res.status(404).send({
            message: 'No existen resultados'
        })
        res.status(200).send({
            alumnos: [resultado]
        });
    }).lean();
});

router.get('/api/clases', (req, res) => {
    Clase.find({}, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado) return res.status(404).send({
            message: 'No existen resultados'
        })
        res.status(200).send({
            clases: [resultado]
        });
    }).lean();
});

router.get('/api/prog', (req, res) => {
    Progreso.find({}, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado) return res.status(404).send({
            message: 'No existen resultados'
        })
        res.status(200).send({
            prog: [resultado]
        });
    }).lean();
});

router.get('/admon', (req, res) => {
    var clist = {
        esp: {
            video: [],
            audio: [],
            imagen: [],
            act: []
        },
        mate: {
            video: [],
            audio: [],
            imagen: [],
            act: []
        }
    };
    Clase.find({}, (err, resultado) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        if (!resultado) res.render('pages/admon', {
            layout: 'layoutB',
            title: 'Herramientas',
            status: 'none',
            clist
        });
        resultado.forEach(element => {
            let newel = {
                id: element._id,
                titulo: element.titulo
            };
            if (element.curso == 'esp') {
                if (element.tipo == 'video') {
                    clist.esp.video.push(newel);
                }
                if (element.tipo == 'audio') {
                    clist.esp.audio.push(newel);
                }
                if (element.tipo == 'imagen') {
                    clist.esp.imagen.push(newel);
                }
                if (element.tipo == 'actividad') {
                    clist.esp.act.push(newel);
                }
            }
            if (element.curso == 'mat') {
                if (element.tipo == 'video') {
                    clist.mate.video.push(newel);
                }
                if (element.tipo == 'audio') {
                    clist.mate.audio.push(newel);
                }
                if (element.tipo == 'imagen') {
                    clist.mate.imagen.push(newel);
                }
                if (element.tipo == 'actividad') {
                    clist.mate.act.push(newel);
                }
            }
        });
        res.render('pages/admon', {
            layout: 'layoutB',
            title: 'Herramientas',
            status: 'none',
            clist
        });
    }).lean();

});

router.post('/admon', (req, res) => {
    var status = 'none';
    if (req.body.hasOwnProperty("act")) {
        let nvoClase = new Clase();
        nvoClase.curso = req.body.curso;
        nvoClase.titulo = req.body.titulo;
        nvoClase.texto = req.body.texto;
        nvoClase.tipo = req.body.tipo;
        var inst = req.body.inst.split(',');
        nvoClase.inst = inst;
        // console.log(nvoClase);
        nvoClase.save((err, registro) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición : ${err}`
            });
            clist = mFunc.getClassList();
            res.redirect('/admon');
            // res.render('pages/admon',{layout:'layoutB' ,title:'Herramientas', status : 'act',clist});
        });
    }
    if (req.body.hasOwnProperty("class")) {
        let nvoClase = new Clase();
        nvoClase.curso = req.body.curso;
        nvoClase.titulo = req.body.titulo;
        nvoClase.texto = req.body.texto;
        nvoClase.tipo = req.body.tipo;
        nvoClase.matname = req.body.matname;
        nvoClase.material = req.body.material;
        nvoClase.bckupMat = req.body.bckupMat;
        var inst = req.body.inst.split(',');
        nvoClase.inst = inst;
        nvoClase.save((err, registro) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición : ${err}`
            });
            clist = mFunc.getClassList();
            res.redirect('/admon');
            // res.render('pages/admon',{layout:'layoutB' ,title:'Herramientas', status: 'class',clist});
        });
    }
    if (req.body.hasOwnProperty("elact")) {

        Clase.findByIdAndDelete({
            _id: req.body.id
        }, (err, registro) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición : ${err}`
            });
            clist = mFunc.getClassList();
            res.redirect('/admon');
            // res.render('pages/admon',{layout:'layoutB' ,title:'Herramientas', status:'borrado',clist});
        });
    }
});

router.get('/dev/clases', (req, res) => {
    res.render('pages/creadorDeClases', {
        layout: 'layoutB',
        title: 'Herramienta de creacion',
        listo: 'no'
    });
});

router.get('/dev/clases/woop', (req, res) => {
    res.render('pages/creadorDeClases', {
        layout: 'layoutB',
        title: 'Herramienta de creacion',
        listo: 'yes'
    });
});

router.post('/dev/clases', crearClaseNueva);

//MidleWAREs Administrativos
function crearClaseNueva(req, res, next) {
    let nvoClase = new Clase();
    nvoClase.curso = req.body.curso;
    nvoClase.titulo = req.body.title;
    nvoClase.texto = req.body.texto;
    nvoClase.tipo = 'imagen';
    nvoClase.matname = req.body.titlemat;
    nvoClase.material = req.body.material;
    nvoClase.bckupMat = req.body.material;
    var inst = req.body.inst.split(';');
    nvoClase.inst = inst;
    nvoClase.save((err, registro) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición : ${err}`
        });
        res.redirect('/dev/clases/woop');
    });
}