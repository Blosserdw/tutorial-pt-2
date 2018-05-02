const express = require("express");
const app = express();
var fs = require('fs'); // file system
const http = require("http");

/* var options = {
	key: fs.readFileSync('encryption/server.key'),
	cert: fs.readFileSync( 'encryption/server.crt' ),
	requestCert: false,
    rejectUnauthorized: false,
}; */

const server = http.createServer(app);
const io = require("socket.io")(server);

/* app.get('/', (req, res) => {
  res.send('HEY!')
}); */


//io.attach(4567);



var browserClients = [];

io.on('connection', function(socket){
	
	//console.log("Some kind of user connected to socket...");
	//console.log("Connection type is: " + socket.request.query['connectionType']);
	//console.dir(socket.request._query.connectionType);
	
	var connectionType = socket.request._query.connectionType;
	
	if (connectionType === "game"){
		console.log("\x1b[36;1m%s\x1b[0m", "UNITY GAME socket connected."); // weird stuff at the front of this log is for cyan color https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
		socketToUnityGame = socket;
		
		SetupGameConnectionEvents(socket);
		
		socket.on('disconnect', function(){
			console.log("\x1b[31;1m%s\x1b[0m", "UNITY GAME socket disconnected.");
			socketToUnityGame = null;
		});
	}
	else if (connectionType === "browser"){
		console.log("\x1b[35;1m%s\x1b[0m", "TWITCH EXTENSION socket connected.");
		// Make sure all browser connections get removed from our array of connections on disconnect
		socket.on("disconnect", function(){
			console.log("\x1b[31;1m%s\x1b[0m", "TWITCH EXTENSION socket disconnected.");
			browserClients.splice(browserClients.indexOf(socket), 1); // remove this connection from our list
		});
		
		socket.on('browserConnection', function(authInfo, callback){
			console.log("Browser connected to server!!");
			socket.emit("connectionSuccess", "You connected to the server!");
			//console.dir(authInfo);
			/* jwt.verify(authInfo.token, Buffer.from(clientSecret, 'base64'), function(err, decoded){
				console.log("\x1b[35;1m%s\x1b[0m", "AuthInfo before decode is: ");
				console.dir(authInfo);
				console.log("\x1b[35;1m%s\x1b[0m", "Decoded JWT is: ");
				console.dir(decoded);
				if (err){
					console.log("There was an error with the JWT, disconnecting...");
					callback({connected:'no'});
					socket.disconnect();
				}
				else{
					console.log("\x1b[35;1m%s\x1b[0m", "JWT verified! Setting up socket for opaque_user_id: " + decoded.opaque_user_id);
					socket.opaqueUserId = decoded.opaque_user_id; // need to store opaque ID as per viewer data in case we can't get twitch ID
					socket.twitchUserId = decoded.user_id; // associate twitch userID with this socket
					browserClients.push(socket); // add this verified socket to our list
					SetupBrowserConnectionEvents(socket, decoded);
					callback({connected:'yes', playerType:'normal'});
					// Need to send this information to the game, set up user by doing twitch API calls to get display name/etc
				}
			}); */
		});
	}
	else{
		// This logic shouldn't even get here because if the JWT is not valid, the browser never sends a connection
		// I guess it'd have to be from somwhere else other than viewer.html that is trying to connect for some reason
		console.log("Couldn't determine what this connection is, shutting it down.");
		socket.on("disconnect", function(){
			console.log("Diconnecting foreign socket now!");
		});
		socket.disconnect();
	}
})







app.use(express.static('public')); // serve up a static index.html page
var port = process.env.PORT || 3000;
//var host = "127.0.0.1";
server.listen(port, function() {
   console.log('listening on *:' + port);
});