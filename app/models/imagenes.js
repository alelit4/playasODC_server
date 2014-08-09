var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var imagenSchema = new Schema({
    idPlaya: String,
    idUsuario: String,
    nombreUsuario: String,
    comentario: String,
    link: String,
    fecha: Date
});


//Export the schema
module.exports = mongoose.model('Imagen', imagenSchema)