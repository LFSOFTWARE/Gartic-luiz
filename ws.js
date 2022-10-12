const express = require("express")
const app = express();
const http = require("http")
const morgan = require("morgan")
const cors = require('cors')
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const server = http.createServer(app)
const io = new Server(server);

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('port', process.env.port || 8000)

app.get('/', (req, res) => res.render('index.html'))

io.on('connection', (socket) => {
  socket.on('draw', (e) => {
    io.emit('desenhe',{cord: e , user: socket.id, color: e.color, widthStroke: e.widthStroke, type: e.type});
  });
  socket.on('finish', (e) => {
    io.emit('finish',e);
  });
  socket.on('reload', (e) => {
    io.emit('reload',e);
  });
});


server.listen(app.get('port'), () => {
  console.log("Server is up on port => " + app.get('port'));
})