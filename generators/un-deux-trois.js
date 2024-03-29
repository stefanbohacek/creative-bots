const fs = require('fs'),
      Canvas = require('canvas'),
      GIFEncoder = require('gifencoder'),
      concat = require('concat-stream'),      
      helpers = require(__dirname + '/../helpers/helpers.js');

module.exports = (options, cb) => {
  /* 
    Based on https://generativeartistry.com/tutorials/un-deux-trois/
  */

  console.log('un, duex, trois...');

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
    encoder.setQuality(10); // image quality, 10 is default.
  }

  ctx.lineWidth = helpers.getRandomInt(1,4);
  ctx.fillStyle = colors[0];
  ctx.strokeStyle = colors[1];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';

  if (options.animate){
    encoder.addFrame(ctx);
  }

  let step = helpers.getRandomInt(15,25);
  let aThirdOfHeight = height/3;

  const draw = (x, y, width, height, positions) => {
    ctx.save();
    ctx.translate(x + width/2, y + height/2)
    ctx.rotate(Math.random() * 5);
    ctx.translate(-width/2, -height/2)

    for(let i = 0; i <= positions.length; i++) {
      ctx.beginPath();
      ctx.moveTo(positions[i] * width, 0);
      ctx.lineTo(positions[i] * width, height);
      ctx.stroke();
    }

    ctx.restore();
  }

  for( let y = step; y < width - step; y += step) {
    for( let x = step; x < width - step; x+= step ) {
      if( y < aThirdOfHeight) {
        draw(x, y, step, step, [0.5]);   
      } else if ( y < aThirdOfHeight * 2) {
        draw(x, y, step, step, [0.2, 0.8]);      
      } else {
        draw(x, y, step, step, [0.1, 0.5, 0.9]);      
      }
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
