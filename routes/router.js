//App routes  
module.exports = function (app) {

    var user = require('../app/controllers/user');
    var utilities = require('../app/controllers/utilities');
    var playas = require('../app/controllers/playas');
    var usuarios = require('../app/controllers/usuarios');
    var checkin = require('../app/controllers/checkin');
    var passport = require('passport');

    /* Home Page */
    app.get('/', utilities.index);

    /* Playas */
    app.get('/playas', playas.getall);
    app.post('/algunasplayas', playas.getsome);
    app.get('/playas/:id', playas.get);

    app.post('/nuevaplaya', playas.new);
    app.post('/editarplaya/:id', playas.edit);
    app.post('/valoracionplaya/:idplaya/:idfb', playas.valorar);
    app.post('/mensajebotellaplaya/:idplaya/:idfb', playas.mensajebotella);
    app.get('/playascercanas/:latitud/:longitud', playas.playascercanas);
    app.get('/playasbyname/:name', playas.playasbyname);
    app.get('/ultimoscheckins/:idUsuario', playas.ultimoscheckins);

    app.get('/mensajesplaya/:idPlaya', playas.mensajesplaya);
    app.get('/comentariosplaya/:idPlaya', playas.comentariosplaya);


    app.post('/borrarplaya/:id', playas.borrar);
    //app.delete('/playas/:id', playas.delete);

    /* Usuarios */
    app.get('/usuarios', usuarios.getall);
    app.get('/usuarios/:idFacebook', usuarios.get);
    app.get('/usuarios/:id', usuarios.get_id);
    app.put('/usuarios', usuarios.new);
    app.post('/usuarios/:idFacebook', usuarios.edit);
    app.delete('/usuarios/:idFacebook', usuarios.delete); // TODO -> arreglar (borra pero da error)
    app.delete('/borrarusuario/:id', usuarios.delete2); // para depurar

    /*Opciones avanzadas*/
    app.post('/quitarplaya/:idFacebook', usuarios.deleteplaya);
    app.get('/idplayasfavoritas/:idFacebook', usuarios.favoritas_id);
    app.get('/playasfavoritas/:idFacebook', usuarios.favoritas); // <--

    /* Checkin */
    app.get('/checkin', checkin.getall);
    app.get('/checkin/:idUsuario', checkin.get);
    app.post('/checkin/:idUsuario/:idPlaya', checkin.new);


    /* FUTURO */
    //petición get para acceder a la página de login
    app.get('/login', utilities.index);
    //petición post para hacer el login
    app.post('/login', user.authenticate);
    //petición post para registrar un usuario
    app.post('/signup', user.signup);

    app.post('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/register', utilities.login);

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

}