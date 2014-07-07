var mongoose = require('mongoose'),
    _ = require('underscore');
var CheckinModel = require('../models/checkin');
var utilities = require('../controllers/utilities');
var respuestaOk = {"res" : "ok"}; // Respuestas en JSON para usar Volley y que no de problemas
var respuestaError = {"res" : "error"};

/************************************************************************************/
/*******    API Responces                                                  **********/
/************************************************************************************/
/* All checkins */
exports.getall = function (req, res) {
    CheckinModel.find(function (err, checkins) {
        if (!err) {
            res.send(checkins);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

/* All checkins of user */
exports.get = function (req, res) {
    if (req.body.fecha === null){
        checkinsSinRango(req, res);
    } else {
       checkinsRango(req, res);
    }
};


/* New checkin */
exports.new = function (req, res) {
    var checkinnuevo = new CheckinModel({
        idPlaya: req.body.idPlaya,
        idUsuario: req.params.id,
        fecha : Date()
    });
    checkinnuevo.save();
    console.log("Creamos el checkin", checkinnuevo);
    res.send(respuestaOk);
};

/************************************************************************************/
/*******    Otras funciones (internas)                                     **********/
/************************************************************************************/
function checkinsSinRango(req, res){
    CheckinModel.find({idUsuario: req.params.idUsuario}, function (err, checkins) {
        if (!err) {
            res.send(checkins);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

function checkinsRango(req, res){
    CheckinModel.find({idUsuario: req.params.idUsuario, fecha: {$lte: utilities.parseDate(req.body.fecha)} })
        .exec( function (err, checkins) {
            if (!err) {
                res.send(checkins);
            } else {
                console.log(err);
                res.send(respuestaError);
            }
        });

}

