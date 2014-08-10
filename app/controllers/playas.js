var mongoose = require('mongoose'),
    _ = require('underscore');
var PlayasModel = require('../models/playas');
var ComentariosModel = require('../models/comentarios');
var MensajesModel = require('../models/mensajes');
var ImagenesModel = require('../models/imagenes');
var CheckinModel = require('../models/checkin');
var Utilities = require('./utilities');

var respuestaOk = {"res" : "ok"}; // Respuestas en JSON para usar Volley y que no de problemas
var respuestaError = {"res" : "error"};
var respuestaExiste = {"res" : "existe"};

var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
Boolean.parse = function(val) { 
    return !falsy.test(val) && !!val;
};

/************************************************************************************/
/*******    API Responces                                                  **********/
/************************************************************************************/
/* All beaches */
exports.getall = function (req, res) {
    PlayasModel.find(function (err, playas) {
        if (!err) {
            res.send(playas);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

/* some beaches */
exports.getsome = function (req, res) {
   PlayasModel.find({_id : {$all : req.body.playas }} , function (err, data) {
        if (!err) {
             console.log("Encontramos una playa" + data);
             res.send(data);
        } else {
             console.log(err);
             res.send(respuestaError);
        }
   });
   res.send(respuestaOk);
};

/* A beach */
exports.get = function (req, res) {
    PlayasModel.findById( req.params.id, function (err, playa) {
        if (!err) {
            res.send(playa);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

/* New beach */
exports.new = function (req, res) {
    PlayasModel.find({geo: {$near: [parseFloat(req.body.lon), parseFloat(req.body.lat)], $maxDistance : 100/111000.12}}).exec(function (err, playas) {
        if (!err) {
            if ((playas !== undefined) && (playas !== null) && (playas.length > 0)){
                res.send(respuestaExiste);
            } else {
                var playanueva = new PlayasModel({
                    nombre : req.body.nombre,
                    geo: [parseFloat(req.body.lon), parseFloat(req.body.lat)],
                    banderaAzul: Boolean.parse(req.body.banderaazul),
                    dificultadAcceso:  req.body.acceso,
                    tipoArena:  req.body.arena,
                    limpieza:  req.body.limpieza,
                    rompeolas:  Boolean.parse(req.body.rompeolas),
                    hamacas: Boolean.parse(req.body.hamacas),
                    sombrillas:  Boolean.parse(req.body.sombrillas),
                    chiringuitos:  Boolean.parse(req.body.chiringuitos),
                    perros: Boolean.parse(req.body.perros),
                    nudista: Boolean.parse(req.body.nudista),
                    cerrada: Boolean.parse(req.body.cerrada),
                    duchas:  Boolean.parse(req.body.duchas),
                    socorrista:  Boolean.parse(req.body.socorristas),
                    webcamURL:  req.body.webcamURL,
                });
                playanueva.save();
                res.send(playanueva);
            }
        } else {
            res.send(respuestaError);
        }
        
    });
};

/* Edit beach */
exports.edit = function (req, res, params) {
    PlayasModel.findById( req.params.id).exec(function (err, playa) {
        if (!err) {
            revisamosParams(req, playa);
            playa.save();
            res.send(respuestaOk);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });

};

exports.valorar = function (req, res, params) {
    ComentariosModel.find({idUsuario: req.params.idfb, idPlaya: req.params.idplaya, fecha: {$gte: Utilities.parseDateOnlyDate(req.body.fecha)}}, function (err, comentarios) {
        if (!err) {
            if ((comentarios === undefined) || (comentarios === null) || (comentarios.length === 0)){
                var comentario = new ComentariosModel({
                    idPlaya: req.params.idplaya,
                    idUsuario: req.params.idfb,
                    nombreUsuario: req.body.nombreautor,
                    valoracion: parseFloat(req.body.valoracion),
                    fecha: Utilities.parseDate(req.body.fecha),
                    comentario: req.body.comentario
                });

                PlayasModel.findById(req.params.idplaya).exec(function (err, playa) {
                    if (!err) {
                        var total = playa.numeroValoraciones*playa.valoracion;
                        playa.numeroValoraciones = playa.numeroValoraciones + 1;
                        playa.valoracion = (total + parseFloat(req.body.valoracion)) / playa.numeroValoraciones;
                        playa.save();
                        comentario.save();
                        res.send(playa);
                    } else {
                        console.log(err);
                        res.send(respuestaError);
                    }
                });
            } else {
                res.send(respuestaExiste);
            }
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

exports.mensajebotella = function (req, res, params) {
    var mensajeb = new MensajesModel({
        idPlayaOrigen: req.params.idplaya,
        idPlayaDestino: req.params.idplaya,
        idUsuario: req.params.idfb,
        nombrePlayaDestino: req.body.nombrePlaya,
        nombreUsuario: req.body.nombreAutor,
        fecha: Utilities.parseDate(req.body.fecha),
        mensaje: req.body.mensaje
    });

    mensajeb.save();
    // TODO: Enviar el nombre de la playa destino cuando sea aleatorio
    res.send(respuestaOk);
};

exports.nuevaimagen = function (req, res, params) {
    var imagen = new ImagenesModel({
        idPlaya: req.params.idplaya,
        idUsuario: req.params.idfb,
        nombreUsuario: req.body.nombreAutor,
        fecha: Utilities.parseDate(req.body.fecha),
        comentario: req.body.comentario,
        link: req.body.link
    });

    imagen.save();

    res.send(respuestaOk);
};

exports.playascercanas = function (req, res) {
    PlayasModel.find({geo: {$near: [parseFloat(req.params.longitud), parseFloat(req.params.latitud)], $maxDistance : 25000/111000.12}}).limit(20).exec(function (err, playas) {
        if (!err) {
            res.send(playas);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

exports.playasbyname = function (req, res) {
    PlayasModel.find({nombre: new RegExp(req.params.name, "i")}).limit(20).exec(function (err, playas) {
        if (!err) {
            res.send(playas);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

exports.mensajesplaya = function (req, res) {
    MensajesModel.find({idPlayaDestino: req.params.idPlaya}).limit(20).exec(function (err, mensajes) {
        if (!err) {
            res.send(mensajes);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

exports.imagenesplaya = function (req, res) {
    ImagenesModel.find({idPlaya: req.params.idPlaya}).limit(20).exec(function (err, imagenes) {
        if (!err) {
            res.send(imagenes);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

exports.comentariosplaya = function (req, res) {
    ComentariosModel.find({idPlaya: req.params.idPlaya}).limit(20).exec(function (err, comentarios) {
        if (!err) {
            res.send(comentarios);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

exports.ultimoscheckins = function (req, res) {
    CheckinModel.find({idUsuario: req.params.idUsuario}).sort([["date", "ascending"]]).exec(function (err, checkins) {
        if (!err) {
            var idplayas = checkins.map(function(x){return x.idPlaya});
            PlayasModel.find({_id : {$in : idplayas}} , function (err, playas) {
                if (!err) {
                    var numbers = 0;
                     playas.forEach(function (playa){
                        checkins.forEach(function (checkin){
                            if (checkin.idPlaya == playa._id){
                                playa.checkin = checkin.fecha;
                                numbers++;
                                return false;
                            }
                        });
                        if (numbers == 5)
                            return false;
                     });
                     res.send(playas);
                } else {
                     console.log(err);
                     res.send(respuestaError);
                }
            });
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};


/* "Borrar" beach */
exports.borrar = function (req, res, params) {
    PlayasModel.findById( req.params.id).exec(function (err, playa) {
            if (!err) {
                playa.peticionBorrado = true;
                playa.save();
                res.send(respuestaOk);
            } else {
                console.log(err);
                res.send(respuestaError);
            }
        });
};

/* Delete beach */
exports.delete = function(req, res, params){
    PlayasModel.findOne({_id : req.params.id})
        .exec(function (err, playa) {
            if (!err) {
                console.log("Borramos la playa", playa);
                if(playa != null){
                    playa.remove();
                    res.send(respuestaOk);
                }
            }
            console.log(err);
            res.send(respuestaError);
        });
}

/************************************************************************************/
/*******    Otras funciones (internas)                                     **********/
/************************************************************************************/
function revisamosParams(req, playa){
    if(req.body.nombre != null)
        playa.nombre = req.body.nombre;
    if(req.body.lon != null && req.body.lat != null)
        playa.geo = [parseFloat(req.body.lon), parseFloat(req.body.lat)];
    if(req.body.banderaazul != null){
        playa.banderaAzul = Boolean.parse(req.body.banderaazul);
    } if(req.body.acceso != null)
        playa.dificultadAcceso = req.body.acceso;
    if(req.body.arena != null)
        playa.tipoArena = req.body.arena;
    if(req.body.limpieza != null)
        playa.limpieza = req.body.limpieza;
    if(req.body.rompeolas != null)
        playa.rompeolas = Boolean.parse(req.body.rompeolas);
    if(req.body.hamacas != null)
        playa.hamacas = Boolean.parse(req.body.hamacas);
    if(req.body.sombrillas != null)
        playa.sombrillas = Boolean.parse(req.body.sombrillas);
    if(req.body.chiringuitos != null)
        playa.chiringuitos = Boolean.parse(req.body.chiringuitos);
    if(req.body.duchas != null)
        playa.duchas = Boolean.parse(req.body.duchas);
    if(req.body.perros != null)
        playa.perros = Boolean.parse(req.body.perros);
    if(req.body.cerrada != null)
        playa.cerrada = Boolean.parse(req.body.cerrada);
    if(req.body.nudista != null)
        playa.nudista = Boolean.parse(req.body.nudista);
    if(req.body.socorrista != null)
        playa.socorrista = Boolean.parse(req.body.socorrista);
};