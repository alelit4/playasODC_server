/**
 * Created by Ale on 1/07/14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var checkinSchema = new Schema({
    idPlaya: String,
    idUsuario: String,
    fecha: Date
});


//Export the schema
module.exports = mongoose.model('Checkin', checkinSchema)
