var models = require('../models/models.js');

var stats = {
	quizes: 0,
	comments: 0,
	averange: 0,
	commentedQuizes: 0,
	uncommentedQuizes: 0,
	unpublishedComments: 0,
	unpublishedPercent: 0
};

var errors = [];


exports.calculate = function(req, res, next){
	models.Quiz.count().then(function(quizes){
		stats.quizes = quizes;
		return models.Comment.count();
	}).then(function(comments){
		stats.comments = comments;
		return models.Comment.commentedQuizes();
	}).then(function(commentedQuizes){
		stats.commentedQuizes = commentedQuizes;
		return models.Comment.unpublishedComments();
	}).then(function(unpublishedComments){
		stats.unpublishedComments = unpublishedComments;
		stats.quizes?(stats.averange = stats.comments / stats.quizes):0;
//		if(stats.comments/stats.quizes > 0){
//			stats.averange = stats.comments/stats.quizes;
//		}
		stats.uncommentedQuizes = stats.quizes - stats.commentedQuizes;
		stats.comments?(stats.unpublishedPercent = stats.unpublishedComments * 100 / stats.comments):100;
	}).catch(function(err){
		errors.push(err);
	}).finally(function(){
		next();
	});
};

exports.show = function(req, res, next){
	res.render('quizes/statistics', {stats: stats, errors: errors});    
};