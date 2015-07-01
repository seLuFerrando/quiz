var models = require('../models/models.js');
//var errores = new Array();
// Autoload - factorize if route include :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes             --is the list or filtered list
exports.index = function(req, res) {
  var filter = { };
  if(req.query.search){
    search = req.query.search;
    search = search.split(" ").join("%");
    search = "%" + search + "%";
    filter = {
      where: ["lower(pregunta) like lower(?)", search],
      order: [["pregunta", "ASC"]]
    };
  }

  models.Quiz.findAll(filter).then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes, errors: []});
  }).catch(function(error) { next(error);})
};

// GET /quizes/:id         --is the request
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
  })
};

// GET /quizes/:id/answer  --is the answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new         --is empty
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
          {pregunta: 'Pregunta', respuesta: 'Respuesta'});
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create     -- create new question
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz);
  var errors = quiz.validate();
  var errores = new Array();
  if(errors){
    var i=0;
    for( var prop in errors){
      errores[i++]={message: errors[prop]}; 
    }
    res.render('quizes/new', {quiz: quiz, errors: errores});    
  }else{
     quiz
      .save({ fields: ['pregunta', 'respuesta'] })
      .then(function(){ res.redirect('/quizes') })

  }
};

// GET /quizes/:id/edit    --edit quiz
exports.edit = function(req, res) {
  var quiz = req.quiz;
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id         -- update DB
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  var errors = req.quiz.validate();
  var errores = new Array();
  if(errors){
    var i=0;
    for( var prop in errors){
      errores[i++]={message: errors[prop]}; 
    }
    res.render('quizes/edit', {quiz: req.quiz, errors: errores});    
  }else{
     req.quiz
      .save({ fields: ['pregunta', 'respuesta'] })
      .then(function(){ res.redirect('/quizes') })

  }
};

// DELETE /quizes/:id       -- delete DB
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};