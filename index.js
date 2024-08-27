const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


  
//const io = require('socket.io')(3000) // Corrected require statement with quotes
const users = {}; // Object to store users with their socket IDs

io.on('connection', socket => {
  // Event listener for when a new user joins
  socket.on('new-user-joined', name => {
    users[socket.id] = name; // Save the user's name with their socket ID
    socket.broadcast.emit('user-joined', name); // Broadcast to others that a new user has joined
  });

  // Event listener for when a user sends a message
  
  socket.on('send', message => {
    // Broadcast the message to all other users
    socket.broadcast.emit('receive', { name: users[socket.id], message: message });
});

  // Event listener for when a user disconnects
  socket.on('disconnect', () => {
    const name = users[socket.id]; // Get the name of the disconnected user
    delete users[socket.id]; // Remove the user from the users object
    socket.broadcast.emit('user-left', name); // Broadcast to others that the user has left
  });
});  

app.use(express.static('public')); // 'public' is the folder where index.html is located
app.get('/',function(req,res){
  res.sendFile(__dirname+"/index.html")
 })
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});














