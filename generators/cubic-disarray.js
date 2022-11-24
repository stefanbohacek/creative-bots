const fs = require('fs'),
      Canvas = require('canvas'),
      GIFEncoder = require('gifencoder'),
      concat = require('concat-stream'),      
      helpers = require(__dirname + '/../helpers/helpers.js');

module.exports = (options, cb) => {
  /* 
    Based on http://generativeartistry.com/tutorials/cubic-disarray/
  */
  console.log('making cubes...');
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

  let size = height;
  let squareSize = 40;
  let randomDisplacement = 15;
  let rotateMultiplier = 20;

  const draw = (width, height) => {
    ctx.beginPath();
    ctx.rect(-width/2, -height/2, width, height);
    ctx.stroke(); 
  }

  for (let i = squareSize; i <= width - squareSize; i += squareSize) {
    for (let j = squareSize; j <= height - squareSize; j+= squareSize) {
      let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      let rotateAmt = j / size * Math.PI / 180 * plusOrMinus * Math.random() * rotateMultiplier;

      plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      let translateAmt = j / size * plusOrMinus * Math.random() * randomDisplacement;

      ctx.save();
      ctx.translate(i + translateAmt, j)
      ctx.rotate(rotateAmt);
      draw(squareSize, squareSize);
      if (options.animate){
        encoder.addFrame(ctx);
      }
      ctx.restore();
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