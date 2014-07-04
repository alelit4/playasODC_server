var mongoose = require('mongoose'),
    _ = require('underscore');
var PlayasModel = require('../models/playas');

var respuestaOk = {"res" : "ok"}; // Respuestas en JSON para usar Volley y que no de problemas
var respuestaError = {"res" : "error"};

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

/* New beach */
exports.new = function (req, res) {
    var playanueva = new PlayasModel({
        nombre : req.body.nombre,
        geo: [parseFloat(req.body.lon), parseFloat(req.body.lat)],
        banderaAzul: req.body.banderaazul,
        dificultadAcceso:  req.body.acceso,
        tipoArena:  req.body.arena,
        rompeolas:  req.body.rompeolas,
        hamacas: req.body.hamacas,
        sombrillas:  req.body.sombrillas,
        chiringuitos:  req.body.chiringuitos,
        duchas:  req.body.duchas,
        socorrista:  req.body.socorristas
    });
    playanueva.save();
    console.log("Creamos la playa", playanueva);
    res.send(respuestaOk);
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
        playa.banderaAzul = req.body.banderaAzul;
    if(req.body.acceso != null)
        playa.dificultadAcceso = req.body.acceso;
    if(req.body.arena != null)
        playa.tipoArena = req.body.arena;
    if(req.body.rompeolas != null)
        playa.rompeolas = req.body.rompeolas;
    if(req.body.hamacas != null)
        playa.hamacas = req.body.hamacas;
    if(req.body.sombrillas != null)
        playa.sombrillas = req.body.sombrillas;
    if(req.body.chiringuitos != null)
        playa.chiringuitos = req.body.chiringuitos;
    if(req.body.duchas != null)
        playa.duchas = req.body.duchas;
    if(req.body.socorristas != null)
        playa.socorrista = req.body.socorristas;
};