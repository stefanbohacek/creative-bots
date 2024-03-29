const fs = require('fs'),
      Canvas = require('canvas'),
      GIFEncoder = require('gifencoder'),
      concat = require('concat-stream'),      
      helpers = require(__dirname + '/../helpers/helpers.js');

module.exports = (options, cb) => {
  /* 
    Based on http://generativeartistry.com/tutorials/tiled-lines/
  */
  console.log('drawing lines...');
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
    encoder.setDelay(200);   // frame delay in milliseconds
    encoder.setQuality(10); // image quality, 10 is default.
  }

  ctx.lineWidth = helpers.getRandomInt(1,4);
  ctx.fillStyle = colors[0];
  ctx.strokeStyle = colors[1];
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (options.animate){
    encoder.addFrame(ctx);
  }

  let step = helpers.getRandomInt(15,25);

  function draw(x, y, width, height) {
    let leftToRight = Math.random() >= 0.5;

    if( leftToRight ) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);    
    } else {
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y + height);
    }

    ctx.stroke();
  }

  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y+= step ) {
      draw(x, y, step, step);
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
