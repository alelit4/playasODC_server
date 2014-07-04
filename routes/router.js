//App routes  
module.exports = function (app) {

    var user = require('../app/controllers/user');
    var utilities = require('../app/controllers/utilities');
    var playas = require('../app/controllers/playas');
    var usuarios = require('../app/controllers/usuarios');
    var passport = require('passport');

    /* Home Page */
    app.get('/', utilities.index);

    /* Playas */
    app.get('/playas', playas.getall);
    app.put('/playas', playas.new);
    app.post('/playas/:id', playas.edit);
    app.post('/borrarplaya/:id', playas.borrar);
    app.delete('/playas/:id', playas.delete);

    /* Usuarios */
    app.get('/usuarios', usuarios.getall);
    app.put('/usuarios', usuarios.new);
    app.post('/usuarios/:idFacebook', usuarios.edit);
    app.delete('/usuarios/:idFacebook', usuarios.delete); // TODO -> arreglar (borra pero da error)
    app.delete('/borrarusuario/:id', usuarios.delete2); // para depurar

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