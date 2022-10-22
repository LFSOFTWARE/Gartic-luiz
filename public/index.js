
var socket = io();

socket.emit('makeWord', () => {

})

socket.on('desenhe', (msg) => {
  if (msg.user !== socket.id) {
    draw2(msg.cord, msg.color, msg.widthStroke, msg.type, msg.coodinates)
    socket.on('finish', () => {
      ctx.beginPath();
    })
  }

})

socket.on('word', (msg) => {
  console.log(msg.word.word.length);
  document.getElementById("word").innerHTML = msg.word.categoria
  document.getElementById("dica").innerHTML = ''

  for (var i = 0; i < msg.word.word.length; i++) {
    document.getElementById("dica").innerHTML += '_ '
  }
})

socket.on('feed', (msg) => {
  console.log(msg.response);
  if (msg.response) {
    document.getElementById('boxAnswer').innerHTML += `<p style="background:green">${msg.try.answer}</p>`
    socket.emit('makeWord', () => {
    })
  } else {
    document.getElementById('boxAnswer').innerHTML += `<p>${msg.try.answer}</p>`
  }

})


const sendAnswers = () => {
  let input = document.getElementById('answer');
  if (input.value !== '') {
    // document.getElementById('boxAnswer').innerHTML += `<p>${input.value}</p>`;
    socket.emit('answer', {
      answer: input.value.toLowerCase()
    })
  }
  input.value = '';
}

//Canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

//Resizing 
canvas.height = window.innerHeight
canvas.width = 1000

//Variables
let paiting = false
let color = 'black'
let widthStroke = 5
let type = 'line'

let coodinates = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 }
}
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

  if (type === 'circle') {
    coodinates.start = { x: e.clientX, y: e.clientY }
  }
}
const finishPosition = (e) => {
  paiting = false
  ctx.beginPath();
  socket.emit('finish', { msg: true });
  // if(type === 'circle') {

  //  drawCircle(e);
  //  socket.emit('draw', { clientX: e.clientX, clientY: e.clientY, color: color, widthStroke: widthStroke, type: type, coodinates:coodinates })
  // }
}
const draw2 = (e, color, wStroke, ty, coodinat) => {
  if (ty === 'line') {
    ctx.lineWidth = Number(wStroke)
    ctx.lineCap = 'round'
    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = color

    ctx.stroke();
  } else if (ty === 'eraser') {
    ctx.rect(e.clientX, e.clientY, wStroke, wStroke);
    ctx.fillStyle = 'white';
    ctx.fill();
  } else if (ty === 'circle') {
    ctx.strokeStyle = color;
    ctx.lineWidth = Number(wStroke)
    ctx.arc(e.clientX, e.clientY, 50, 0, 2 * Math.PI);
    ctx.stroke();
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
  } else if (type === 'eraser') {
    ctx.rect(e.clientX, e.clientY, widthStroke, widthStroke);
    ctx.fillStyle = 'white';
    ctx.fill();
  } else if (type === 'circle') {
    ctx.strokeStyle = color;
    ctx.lineWidth = Number(widthStroke)
    ctx.arc(e.clientX, e.clientY, 50, 0, 2 * Math.PI);
    ctx.stroke();
    console.log(e.clientX, e.clientY);
  }

  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);

  socket.emit('draw', { clientX: e.clientX, clientY: e.clientY, color: color, widthStroke: widthStroke, type: type, coodinates: coodinates });
}
const drawCircle = (e) => {
  coodinates.end = { x: e.clientX, y: e.clientY }

  let leng = (coodinates.start.y - coodinates.end.y)

  if (leng < 0) {
    leng = leng * -1
  }

  ctx.arc(coodinates.start.x, coodinates.start.y, leng, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#003300';
  ctx.stroke();


}
const drawCircle2 = (e, color2, coodinates2) => {

  let leng = (coodinates2.start.y - coodinates2.end.y)

  if (leng < 0) {
    leng = leng * -1
  }

  ctx.arc(coodinates2.start.x, coodinates2.start.y, leng, 0, 2 * Math.PI);
  ctx.fillStyle = color2;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#003300';
  ctx.stroke();


}


//EventListener
canvas.addEventListener("mousedown", startPosition)
canvas.addEventListener("mouseup", finishPosition)
canvas.addEventListener("mousemove", draw)
