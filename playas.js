// Init Page of Dephisit
//Load app dependencies
var express = require('express'),  
  mongoose = require('mongoose'), 
  path = require('path'),  
  http = require('http'),
  util = require('util'),
  csv = require('csv'),
  fs = require('fs'),
  request = require('request');

var flash 	 = require('connect-flash');
var passport = require('passport');

var PlayasModel = require('./app/models/playas');

var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
Boolean.parse = function(val) { 
    return !falsy.test(val) && !!val;
};


var app = express();

//Configure: bodyParser to parse JSON data
//           methodOverride to implement custom HTTP methods  
//           router to crete custom routes

app.configure(function(){  
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(flash());
  app.use( express.cookieParser() );
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);

});  
  
app.configure('development', function(){  
  app.use(express.errorHandler());
    app.use(function(req, res, next){
        res.locals.user = req.session.user;
        next();
    });
});

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT","DELETE");
    next();

});


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

  
//Sample routes are in a separate module, just for keep the code clean  
routes = require('./routes/router')(app);  


//Connect to the MongoDB test database  
mongoose.connect('mongodb://localhost/playas_db');
  
//Start the server  
http.createServer(app).listen(1479);

console.log("Lanzado en puerto 1479...");

// Trabajando con el CSV
var getCSV = function(){
    var parser = csv.parse({delimiter: ','}, function(err, allRows){
        allRows.forEach(function(row){
            var nombre = (row[0] !== "NULL") ? row[0].trim() : null;
            var latitud = (row[1] !== "NULL") ? row[1].trim() : null;
            var longitud = (row[2] !== "NULL") ? row[2].trim() : null;
            var banderaAzul = (row[3] !== "NULL") ? Boolean.parse(row[3].trim()) : null;

            var dificultadAcceso = (row[4] !== "NULL") ? row[4].trim() : null;
            if (dificultadAcceso != null){
              if ((dificultadAcceso === "baja") || (dificultadAcceso === "bajo")){
                  dificultadAcceso = "facil";
              } else if ((dificultadAcceso === "media") || (dificultadAcceso === "medio")){
                  dificultadAcceso = "media";
              } else if ((dificultadAcceso === "alta") || (dificultadAcceso === "alto")){
                  dificultadAcceso = "extrema";
              } else {
                  dificultadAcceso = "facil";
              }
            }
            var limpieza = (row[5] !== "NULL") ? row[5].trim() : null;
            if (limpieza != null){
              if ((limpieza === "baja") || (limpieza === "bajo")){
                  limpieza = "sucia";
              } else if ((limpieza === "media") || (limpieza === "medio")){
                  limpieza = "normal";
              } else if ((limpieza === "alta") || (limpieza === "alto")){
                  limpieza = "mucho";
              } else {
                  limpieza = "normal";
              }
            }
            var tipoArena = (row[6] !== "NULL") ? row[6].trim() : null;
            if (tipoArena != null){
              if ((tipoArena === "negra") || (tipoArena === "negro")){
                  tipoArena = "negra";
              } else if ((tipoArena === "blanca") || (tipoArena === "blanco")){
                  tipoArena = "blanca";
              } else if ((tipoArena === "piedra") || (tipoArena === "piedras")){
                  tipoArena = "rocas";
              } else {
                  tipoArena = "negra";
              }
            }
            var rompeolas = (row[7] !== "NULL") ? Boolean.parse(row[7].trim()) : null;
            var hamacas = (row[8] !== "NULL") ? Boolean.parse(row[8].trim()) : null;
            var sombrillas = (row[9] !== "NULL") ? Boolean.parse(row[9].trim()) : null;
            var chiringuitos = (row[10] !== "NULL") ? Boolean.parse(row[10].trim()) : null;
            var duchas = (row[11] !== "NULL") ? Boolean.parse(row[11].trim()) : null;
            var socorrista = (row[12] !== "NULL") ? Boolean.parse(row[12].trim()) : null;
            var webcam = (row[13] !== "NULL") ? row[13] : null;
            var playanueva = new PlayasModel({
              nombre : nombre,
              geo: [parseFloat(longitud), parseFloat(latitud)],
              banderaAzul: banderaAzul,
              dificultadAcceso: dificultadAcceso,
              tipoArena: tipoArena,
              limpieza: limpieza,
              rompeolas: rompeolas,
              hamacas: hamacas,
              sombrillas: sombrillas,
              chiringuitos: chiringuitos,
              duchas: duchas,
              socorrista: socorrista,
              webcamURL: webcam,
            });
            playanueva.save();
            
        });
        
    });

    fs.createReadStream(__dirname+'/playas.csv', {encoding: 'UTF-8'}).pipe(parser);


                    /*Establecimiento.findOne({$and: [{direccion: direccion}, {nombre: nombre}, {tipo: tipo}, {municipio: municipio}]}, function(err, encontrado) {  
                        if ((encontrado === null) || (encontrado === undefined)){
                            var establecimiento = new Establecimiento({  
                               nombre: (dato[0] !== "NULL") ? dato[0] : null, 
                               tipo: (dato[1] !== "NULL") ? dato[1] : null,  
                               direccion: (dato[2] !== "NULL") ? dato[2] : null, 
                               numero: (dato[3] !== "NULL") ? dato[3] : null, 
                               cp: (dato[4] !== "NULL") ? dato[4] : null, 
                               latitud: ((dato[5] !== "NULL") && (dato[5].indexOf(",") !== -1)) ? dato[5].replace(",", ".") : "0",  
                               longitud: ((dato[6] !== "NULL") && (dato[5].indexOf(",") !== -1)) ? dato[6].replace(",", ".") : "0",  
                               municipio: (dato[8] !== "NULL") ? dato[8] : null,  
                               plazas: (dato[9] !== "NULL") ? dato[9] : null, });  

                            establecimiento.save();
                            nuevos++;
                        }
                    }); */ 
};

//getCSV();
