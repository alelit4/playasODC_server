var mongoose = require('mongoose'),
    _ = require('underscore');
var UsuariosModel = require('../models/usuarios');

var respuestaOk = {"res" : "ok"}; // Respuestas en JSON para usar Volley y que no de problemas
var respuestaError = {"res" : "error"};

/************************************************************************************/
/*******    API Responces                                                  **********/
/************************************************************************************/
/* All users */
exports.getall = function (req, res) {
    UsuariosModel.find(function (err, usuarios) {
        if (!err) {
            res.send(usuarios);
        } else {
            console.log(err);
            res.send(respuestaError);
        }
    });
};

/* New user */
exports.new = function (req, res) {
    var usuarionuevo = new UsuariosModel({
        idFacebook : req.body.idFacebook,
        playasVisitadas:  [],
        playasValodaras:  [],
        playasCreadas: [],
        playasActualizadas: [],
        playasFavoritas: []
    });
    usuarionuevo.save();
    console.log("Creamos el usuario", usuarionuevo);
    res.send(usuarionuevo);
};

/* Edit user */
exports.edit = function (req, res, params) {
    UsuariosModel.findOne({idFacebook : req.params.idFacebook})
        .exec(function (err, usuario) {
            if (!err) {
                revisamosParams(req, usuario);
                usuario.save();
                console.log("Actualizamos el usuario", usuario);
                res.send(respuestaOk);
            } else {
                console.log(err);
                res.send(respuestaError);
            }
        });

};

/* Delete user */
exports.delete2 = function(req, res, params){
    UsuariosModel.findOne({_id : req.params.id})
        .exec(function (err, usuario) {
            if (!err) {
                console.log("Borramos el usuario", usuario);
                if(usuario != null){
                    usuario.remove();
                    res.send(respuestaOk);
                }
            }
            console.log(err);
            res.send(respuestaError);
        });
};

/* Delete user */
exports.delete = function(req, res, params){
    UsuariosModel.findOne({idFacebook : req.params.idFacebook})
        .exec(function (err, usuario) {
            if (!err) {
                console.log("Borramos el usuario", usuario);
                if(usuario != null){
                    usuario.remove();
                    res.send(respuestaOk);
                }
            }
            console.log(err);
            res.send(respuestaError);
        });
};

/************************************************************************************/
/*******    Otras funciones (internas)                                     **********/
/************************************************************************************/
function revisamosParams(req, usuario){
    if(req.body.idFacebook != null)
        usuario.idFacebook = req.body.idFacebook;
    if(req.body.status != null)
        usuario.status = req.body.status;
    if(req.body.playasVisitadas != null)
        usuario.playasVisitadas.push(req.body.playasVisitadas);

};