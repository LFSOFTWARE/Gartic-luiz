
var socket = io();




socket.on('desenhe', (msg) => {
  if (msg.user !== socket.id) {
    draw2(msg.cord, msg.color,msg.widthStroke)
    socket.on('finish', () => {
      ctx.beginPath();
    })
  }

})

//Canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

//Resizing 
canvas.height = window.innerHeight
canvas.width = window.innerWidth * 0.6

//Variables
let paiting = false
let color = 'black'
let widthStroke = 5
//Functions 
const changeColor = (clr) => {
  color = clr
}
const changeStroke = (stroke) => {
  widthStroke = stroke
}
const startPosition = (e) => {
  paiting = true
  draw(e)
}
const finishPosition = () => {
  paiting = false
  ctx.beginPath();
  socket.emit('finish', { msg: true });

}
const draw2 = (e, color, wStroke) => {

  ctx.lineWidth = Number(wStroke)
  ctx.lineCap = 'round'
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = color

  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);

}
const draw = (e) => {
  if (!paiting) return;

  ctx.lineWidth = widthStroke
  ctx.lineCap = 'round'
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = color
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);

  socket.emit('draw', { clientX: e.clientX, clientY: e.clientY, color: color, widthStroke: widthStroke });
}

//EventListener
canvas.addEventListener("mousedown", startPosition)
canvas.addEventListener("mouseup", finishPosition)
canvas.addEventListener("mousemove", draw)
