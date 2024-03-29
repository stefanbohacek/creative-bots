const fs = require('fs'),
      Canvas = require('canvas'),
      GIFEncoder = require('gifencoder'),
      concat = require('concat-stream'),      
      helpers = require(__dirname + '/../helpers/helpers.js');

module.exports = (options, cb) => {
  /* 
    Based on https://generativeartistry.com/tutorials/triangular-mesh/
  */
  console.log('making triangles...');
  let width = options.width || 1184,
      height = options.height || 506,
      colors = options.colors || ['000', 'fff'],      
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext('2d'),
      encoder;

  if (options.animate){
    encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(concat((data) => {
      if (cb){
        cb(null, data.toString('base64'));
      }
    }));

    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(100);   // frame delay in milliseconds
    encoder.setQuality(5); // image quality, 10 is default.
  }

  ctx.lineWidth = 1;
  ctx.fillStyle = colors[0];
  ctx.strokeStyle = colors[1];
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (options.animate){
    encoder.addFrame(ctx);
  }

  let line, dot,
      odd = false, 
      lines = [],
      gap = width / helpers.getRandomInt(5,12);

  for (let y = -2 * gap / 2; y <= 2 * height; y+= gap){
    odd = !odd
    line = []
    for (let x = -2 * gap / 4; x <= 2 * width; x+= gap){
      line.push({
        x: x + (Math.random()*.8 - .4) * gap  + (odd ? gap/2 : 0),
        y: y + (Math.random()*.8 - .4) * gap,
      })
    }
    lines.push(line)
  }

  const drawTriangle = (pointA, pointB, pointC) => {
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.lineTo(pointC.x, pointC.y);
    ctx.lineTo(pointA.x, pointA.y);
    ctx.closePath();
    ctx.fillStyle = '#' + helpers.randomFromArray(colors); 
    ctx.fill();
    ctx.stroke();
  }

  let dotLine;
  odd = true;

  for (let y = 0; y < lines.length - 1; y++){
    odd = !odd
    dotLine = []
    for (let i = 0; i < lines[y].length; i++){
      dotLine.push(odd ? lines[y][i]   : lines[y+1][i])
      dotLine.push(odd ? lines[y+1][i] : lines[y][i])
    }
    for (let i = 0; i < dotLine.length - 2; i++){
      drawTriangle(dotLine[i], dotLine[i+1], dotLine[i+2])
      if (options.animate){
        encoder.addFrame(ctx);
      }
    }
  }

  if (options.animate){
    encoder.setDelay(2000);
    encoder.addFrame(ctx);
    encoder.finish();
  }
  else{
    cb(null, canvas.toBuffer().toString('base64'));
  }
}