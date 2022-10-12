
var socket = io();




socket.on('desenhe', (msg) => {
  if (msg.user !== socket.id) {
    draw2(msg.cord, msg.color, msg.widthStroke, msg.type)
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
canvas.width = 1200

//Variables
let paiting = false
let color = 'black'
let widthStroke = 5
let type = 'line'
//Functions 
const changeColor = (clr) => {
  color = clr
}
const changeStroke = (stroke) => {
  widthStroke = stroke
}
const setType = (ty) => {
  type = ty
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
const draw2 = (e, color, wStroke, ty) => {
  if (ty === 'line') {
  ctx.lineWidth = Number(wStroke)
  ctx.lineCap = 'round'
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = color

  ctx.stroke();
  }else if (ty === 'eraser') {
    ctx.rect(e.clientX, e.clientY, wStroke, wStroke);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);

}
const draw = (e) => {
  if (!paiting) return;

  if (type === 'line') {
    ctx.lineWidth = widthStroke
    ctx.lineCap = 'round'
    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = color
    ctx.stroke();
  }else if (type === 'eraser') {
    ctx.rect(e.clientX, e.clientY, widthStroke, widthStroke);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);

  socket.emit('draw', { clientX: e.clientX, clientY: e.clientY, color: color, widthStroke: widthStroke, type: type });
}

//EventListener
canvas.addEventListener("mousedown", startPosition)
canvas.addEventListener("mouseup", finishPosition)
canvas.addEventListener("mousemove", draw)
