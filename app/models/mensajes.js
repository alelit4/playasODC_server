/**
 * Created by Ale on 1/07/14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mensajeSchema = new Schema({
    idPlaya: String,
    idUsuario: Number,
    fecha: Date,
    mensaje: String
});


//Export the schema
module.exports = mongoose.model('Mensaje', mensajeSchema)
