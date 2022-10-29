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
app.set('port', process.env.PORT || 8000)

app.get('/', (req, res) => res.render('index.html'))
let secretWord = undefined;
const GenereteWord = () => {
  const words = [
    {
      word: 'carro',
      dica: ['tem roda', 'tem porta'],
      categoria: 'automores',
    },
    {
      word: 'banana',
      dica: ['é amarelo', 'animal come'],
      categoria: 'fruta',

    },
    {
      word: 'arma',
      dica: ['tem ferro', 'é preto'],
      categoria: 'ferramenta',

    },
    {
      word: 'aviao',
      dica: ['tem asas', 'tem motor'],
      categoria: 'veiculo aero',

    },
  ]
  const word = words[Math.floor(Math.random() * words.length)]
  secretWord = word
  return word
}
var user = []
io.on('connection', (socket) => {
  user.push(socket.id);
  socket.emit('connection',{user:user} )
  socket.on('draw', (e) => {
    io.emit('desenhe', { cord: e, user: socket.id, color: e.color, widthStroke: e.widthStroke, type: e.type, coodinates: e.coodinates });
  });
  socket.on('makeWord', () => {
    io.emit('word', { word: GenereteWord() });
  })
  socket.on('finish', (e) => {
    io.emit('finish', e);
  });
  socket.on('reload', (e) => {
    io.emit('reload', e);
  });
  socket.on('answer', (e) => {
    console.log(secretWord);
    console.log(e);
    io.emit('feed', { response:secretWord.word === e.answer, try:e, user: socket.id})
  });
  socket.on('disconnect',(reason) => {
    console.log(socket.id);
    const newUsers = user.filter((e) => e !== socket.id)
    user = newUsers
    socket.emit('connection',{user:user} )
  })
});


server.listen(app.get('port'), () => {
  console.log("Server is up on port => " + app.get('port'));
})