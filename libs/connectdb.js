
/*
	Arquivo de conexão para o MongoDb da IBM referente ao Addon do Compose do Heroku
*/

global.dbInstance = null

module.exports = function(){

	return new Promise(function(resolve, reject){

		if(global.dbInstance == null){

			const MongoClient = require('mongodb').MongoClient

			const url = 'mongodb://heroku_2lkn83r0:gs8bsj8b8oe92u8h43u82gchj9@ds115350.mlab.com:15350/heroku_2lkn83r0'
       
			const dbName = 'heroku_2lkn83r0'

			MongoClient.connect(url, function(err, client) {
			
				if(err) throw err

				console.log("Connected successfully to MongoDb");
			
				var db = client.db(dbName);

				global.dbInstance = db

				resolve(global.dbInstance)

			//   client.close();

				// // TESTE
				// const collection = db.collection('fio da puta')

				// collection.find().limit(5).toArray(function(err, result){
				// 	if(err) throw err

				// 	console.log(result)
				// })

			})
		}
		else{
			resolve(global.dbInstance)
		}
	})

}

// ### MYSQL ####

// var port = 3306

// global.connection = ''


// module.exports = function(){

//     function handleDisconnect(callback){

// 		if(global.connection.length == 0){
// 			var mysql      = require('mysql');
// 			global.connection = mysql.createConnection({
// 				host     : 'us-cdbr-iron-east-05.cleardb.net',
// 				user     : 'b873deef92b794',
// 				password : '74d1b1bd',
// 				database : 'heroku_9b75c0dc6996e54',
// 				port: port
// 			});

// 			global.connection.connect(function(err) {
// 				if (err) {
// 					console.error('error connecting: ' + err.stack);
// 					return;
// 				}

// 				console.log('Conexão realizada com sucesso!');

// 			});

// 			global.connection.on('error', function(err) {
				
// 				if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
// 					console.log('Tentado reconectar novamente ...')
// 					global.connection = ''
// 					handleDisconnect(callback);                         // lost due to either server restart, or a
// 				} 
// 				else {                                      // connnection idle timeout (the wait_timeout
// 					throw err;                                  // server variable configures this)
// 				}
// 			})
			
// 			// return global.connection

// 		}

// 		return global.connection
// 	}

// 	return handleDisconnect()
// 	// return global.connection

// }