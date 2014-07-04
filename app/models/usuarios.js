/**
 * Created by Ale on 1/07/14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    idFacebook: String,
    status: { type: Number, default: 0 }, // gamificacion
    playasVisitadas: [String],
    playasValodaras: [String],
    playasCreadas: [String],
    playasActualizadas: [String],
    playasFavoritas: [String]
});


//Export the schema
module.exports = mongoose.model('Usuario', usuarioSchema)