/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('underscore');

exports.parseDate = function(fecha){
    try {
        var parts = fecha.split(" ");
        var dias = parts[0].split("/");
        var horas = parts[1].split(":");
        return new Date(Date.UTC(dias[2], dias[1]-1, dias[0], horas[0], horas[1], 0));
    } catch (err){
        return new Date();
    }
};

/* Home View */
exports.index = function(req, res) {
  res.render('home');
  console.log(req.isAuthenticated());
};

/* Login View */
exports.login = function(req, res) {
    if(req.isAuthenticated()){
        res.render('logout');
    }
    else{  res.render('login');}

};

