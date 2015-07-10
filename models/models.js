var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Load ORM model
var Sequelize = require('sequelize');

// Use BBDD SQLite or Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // only SQLite (.env)
    omitNull: true      // only Postgres
  }      
);

// Import Quiz table definition
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Import Comment table definition
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// 1 to N relation
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;       
exports.Comment = Comment; 

// sequelize.sync() for inicialitze
sequelize.sync().then(function() {
  Quiz.count().then(function (count){
    if(count === 0) {   // inicialitze only if table is empty
      Quiz.bulkCreate( 
        [ {pregunta: 'Capital de Italia',   respuesta: 'Roma', tema: 'Humanidades'},
          {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'Humanidades'},
        ]
      ).then(function(){console.log('Base de datos inicializada')});
    };
  });
});