/**
 * Created by Ale on 1/07/14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var comentarioSchema = new Schema({
    idPlaya: String,
    idUsuario: Number,
    fecha: Date,
    comentario: String
});


//Export the schema
module.exports = mongoose.model('Comentario', comentarioSchema)
