var mongoose = require('mongoose'),
    _ = require('underscore');
var PlayasModel = require('../models/playas');
var ComentariosModel = require('../models/comentarios');
var Utilities = require('./utilities');

var respuestaOk = {"res" : "ok"}; // Respuestas en JSON para usar Volley y que no de problemas
var respuestaError = {"res" : "error"};

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
   console.log(req.body.playas);
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
    PlayasModel.findById( req.params.id, function (err, playas) {
        if (!err) {
            res.send(playas);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};
/* New beach */
exports.new = function (req, res) {
    console.log("Recibido: "+req.body);
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
        duchas:  Boolean.parse(req.body.duchas),
        socorrista:  Boolean.parse(req.body.socorristas)
    });
    playanueva.save();
    console.log("Creamos la playa", playanueva);
    res.send(playanueva);
};

/* Edit beach */
exports.edit = function (req, res, params) {
    PlayasModel.findById( req.params.id)
    .exec(function (err, playa) {
        if (!err) {
            revisamosParams(req, playa);
            playa.save();
            console.log("Actualizamos la playa", playa);
            res.send(respuestaOk);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });

};

exports.valorar = function (req, res, params) {
    var comentario = new ComentariosModel({
        idPlaya: req.params.idplaya,
        idUsuario: req.params.idfb,
        valoracion: parseFloat(req.body.valoracion),
        fecha: Utilities.parseDate(req.body.fecha),
        comentario: req.body.comentario
    });

    PlayasModel.findById(req.params.idplaya).exec(function (err, playa) {
        if (!err) {
            var total = playa.numeroValoraciones*playa.valoracion;
            playa.numeroValoraciones = playa.numeroValoraciones + 1;
            console.log(playa.numeroValoraciones);
            playa.valoracion = (total + parseFloat(req.body.valoracion)) / playa.numeroValoraciones;
            console.log(playa.valoracion);
            playa.save();
            comentario.save();
            res.send(playa);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};


/* "Borrar" beach */
exports.borrar = function (req, res, params) {
    PlayasModel.findById( req.params.id)
        .exec(function (err, playa) {
            if (!err) {
                playa.activa = false;
                playa.save();
                console.log("Borramos la playa", playa);
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
    if(req.body.banderaazul != null)
        playa.banderaAzul = Boolean.parse(req.body.banderaAzul);
    if(req.body.acceso != null)
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
    if(req.body.socorristas != null)
        playa.socorrista = Boolean.parse(req.body.socorristas);
};