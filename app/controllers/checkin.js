var mongoose = require('mongoose'),
    _ = require('underscore');
var CheckinModel = require('../models/checkin');
var Utilities = require('../controllers/utilities');
var respuestaOk = {"res" : "ok"}; // Respuestas en JSON para usar Volley y que no de problemas
var respuestaExiste = {"res" : "existe"};
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
    CheckinModel.find({idUsuario: req.params.idUsuario, idPlaya: req.params.idPlaya, fecha: {$gte: Utilities.parseDateOnlyDate(req.body.fecha)}}, function (err, checkins) {
        if (!err) {
            if ((checkins === undefined) || (checkins === null) || (checkins.length === 0)){
                var checkinnuevo = new CheckinModel({
                    idPlaya: req.params.idPlaya,
                    idUsuario: req.params.idUsuario,
                    fecha : Utilities.parseDate(req.body.fecha)
                });
                checkinnuevo.save();
                res.send(respuestaOk);
            } else {
                res.send(respuestaExiste);
            }
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
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
    CheckinModel.find({idUsuario: req.params.idUsuario, fecha: {$lte: Utilities.parseDate(req.body.fecha)} })
        .exec( function (err, checkins) {
            if (!err) {
                res.send(checkins);
            } else {
                console.log(err);
                res.send(respuestaError);
            }
        });

}

