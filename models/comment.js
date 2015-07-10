module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Comment',
            { texto: {
            		type: DataTypes.STRING,
            		validate: { notEmpty : {msg: "--> Falta Comentario"}}
            	},
            	publicado: {
            		type: DataTypes.BOOLEAN,
            		defaultValue: false
              	}
            },
            {
                classMethods: {
                    commentedQuizes:function(){
                        return this.aggregate('QuizId', 'count', {distinct: true})
                        .then(function(count){
//                            console.log('QUIZES CON COMENTARIOS ' + count);
                            return count;
                        })
                    },
                    unpublishedComments:function(){
                        return this.count({where:{'publicado':false}})
                        .then(function(count){
//                            console.log('SIN PUBLICAR '+count);
                            return count;
                        })
                    }

                }
            }
        );
};