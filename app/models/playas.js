/**
 * Created by Ale on 1/07/14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Los valores dinánmicos de esta tabla son las medias de los usuarios
var playaSchema = new Schema({
    nombre: String,
    geo: {type: [Number], index: '2d'},
    banderaAzul: Boolean,
    dificultadAcceso: String,
    limpieza: Number,
    tipoArena: String,
    activa: { type: Boolean, default: true }, // para controlar el borrado
    valoracion: { type: Number, default: 0 },
    rompeolas: { type: Boolean, default: false },
    hamacas: { type: Boolean, default: false },
    sombrillas: { type: Boolean, default: false },
    chiringuitos: { type: Boolean, default: false },
    duchas: { type: Boolean, default: false },
    socorrista: { type: Boolean, default: false }
});


//Export the schema
module.exports = mongoose.model('Playa', playaSchema)