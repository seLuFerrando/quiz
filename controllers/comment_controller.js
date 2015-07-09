var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
  models.Comment.find({
            where: {
                id: Number(commentId)
            }
        }).then(function(comment) {
      if (comment) {
        req.comment = comment;
        next();
      } else{next(new Error('No existe commentId=' + commentId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/new         --is empty
exports.new = function(req, res) {
  res.render('comments/new', {quizId: req.params.quizId, errors: []});
};

// POST /quizes/create     -- create new question
exports.create = function(req, res) {
var comment = models.Comment.build(
      { texto: req.body.comment.texto,          
        QuizId: req.params.quizId
        });
  var errors = comment.validate();
  var errores = new Array();
  if(errors){
    var i=0;
    for( var prop in errors){
      errores[i++]={message: errors[prop]}; 
    }
    res.render('comments/new', {comment: comment, quizId: req.params.quizId, errors: errores});    
  }else{
     comment
      .save()
      .then(function(){ res.redirect('/quizes/' + req.params.quizId) })//aqui va el catch
  }
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publicado = true;

  req.comment.save( {fields: ["publicado"]})
    .then( function(){ res.redirect('/quizes/'+req.params.quizId);} )
    .catch(function(error){next(error)});
}; 
