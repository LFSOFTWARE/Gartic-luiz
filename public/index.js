
var socket = io();


window.addEventListener("load", () => {

  socket.on('desenhe', (msg) => {
    if( msg.user !== socket.id ){
      draw2(msg.cord)
      socket.on('finish', () => {
        ctx.beginPath();
      })
    }

  })
  
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext('2d')
  //Resizing 

  canvas.height = window.innerHeight
  canvas.width = window.innerWidth

  let paiting = false

  const startPosition = (e) => {
    paiting = true
    draw(e)
  }

  const finishPosition = () => {
    paiting = false
    ctx.beginPath();
    socket.emit('finish', {msg: true});

  }

  const draw2 = (e) => {

    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);

  }

  const draw = (e) => {
    if (!paiting) return;

    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);

    socket.emit('draw', { clientX: e.clientX, clientY: e.clientY });
  }

  //EventListener
  canvas.addEventListener("mousedown", startPosition)
  canvas.addEventListener("mouseup", finishPosition)
  canvas.addEventListener("mousemove", draw)
})