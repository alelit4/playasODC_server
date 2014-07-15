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

/* Get user */
exports.get = function (req, res) {
    UsuariosModel.findOne({idFacebook : req.params.idFacebook})
        .exec(function (err, usuario) {
            if (!err) {
                res.send(usuario);
            } else {
                console.log(err);
                res.send(respuestaError);
            }
        });
};

/* Get user */
exports.get_id = function (req, res) {
    UsuariosModel.findOne({_id : req.params.id})
        .exec(function (err, usuario) {
            if (!err) {
                res.send(usuario);
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

/* Get playas favoritas por id*/
exports.favoritas_id = function (req, res) {
    UsuariosModel.findOne({idFacebook : req.params.idFacebook})
        .exec(function (err, usuario) {
            if (!err) {
                res.send(usuario.playasFavoritas);
            } else {
                console.log(err);
                res.send(respuestaError);
            }
        });
};


/* Get playas favoritas */
exports.favoritas = function (req, res) {
    UsuariosModel.findOne({idFacebook : req.params.idFacebook})
        .exec(function (err, usuario) {
            if (!err) {
                var ret = {};
                _.each(usuario.playasFavoritas, function (id) {
                    console.log('Soy la playa', id);
                });
                res.send(usuario.playasFavoritas);

            } else {
                console.log(err);
                res.send(respuestaError);
            }
        });
};


/* Edit user */
exports.deleteplaya = function (req, res, params) {
    UsuariosModel.findOne({idFacebook : req.params.idFacebook})
        .exec(function (err, usuario) {
            if (!err) {
                revisamosPlayas(req, usuario);
                usuario.save();
                console.log("Actualizamos el usuario", usuario);
                res.send(respuestaOk);
            } else {
                console.log(err);
                res.send(respuestaError);
            }
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
    if(req.body.playasFavoritas != null)
        usuario.playasFavoritas.push(req.body.playasFavoritas);
    if(req.body.playasValodaras != null)
        usuario.playasValodaras.push(req.body.playasValodaras);
    if(req.body.playasCreadas != null)
        usuario.playasCreadas.push(req.body.playasCreadas);
    if(req.body.playasActualizadas != null)
        usuario.playasActualizadas.push(req.body.playasActualizadas);

};

function revisamosPlayas(req, usuario){
    if(req.body.playasVisitadas != null)
        usuario.playasVisitadas.delete(req.body.playasVisitadas); // TODO arreglar para borrar
    if(req.body.playasFavoritas != null)
        usuario.playasFavoritas.delete(req.body.playasFavoritas);
    if(req.body.playasValodaras != null)
        usuario.playasValodaras.delete(req.body.playasValodaras);
    if(req.body.playasCreadas != null)
        usuario.playasCreadas.delete(req.body.playasCreadas);
    if(req.body.playasActualizadas != null)
        usuario.playasActualizadas.delete(req.body.playasActualizadas);

};