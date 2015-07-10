// MW restricted access
exports.loginRequired = function(req, res, next) {
    if(req.session.user){
        next();
    }else{
        res.redirect('/login');
    }
};

// Get /login   -- Login form
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login   -- If user authenticate session and timeOut is created
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // return error messages
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");        
            return;
       }

       // session is defined in:    req.session.user
        req.session.user = {id:user.id, username:user.username};
       // make session var for auto logout
        req.session.timeOut = (new Date()).getTime();
//        console.log(" - - SESSION CREATE - - ");
        res.redirect(req.session.redir.toString());// redirect last path
    });
};

// DELETE /logout   -- session and timeOut destroy 
exports.destroy = function(req, res) {
    delete req.session.user;
    delete req.session.timeOut;
//    console.log(" - - SESSION DESTROYED - - ");
    res.redirect(req.session.redir.toString()); // redirect last path
};