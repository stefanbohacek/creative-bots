/*  http://jsfiddle.net/X2gp3/ */

import Canvas from 'canvas';
import { Image } from 'canvas';
import GIFEncoder from 'gifencoder';
import concat from 'concat-stream';
import getRandomRange from  '../get-random-range.js';

export default (options, cb) => {
  /* http://jsfiddle.net/X2gp3/ */

  console.log('drawing a spiral...');

  let framesTotal = 16,
      spiralThickness = getRandomRange(4, 20),
      encoder = new GIFEncoder(options.width, options.height),
      counter = 0,
      counterIncrement = getRandomRange(0.7, 1),
      colorForeground = options.color || '#000',
      colorBackground = options.background || '#fff';

  encoder.createReadStream().pipe(concat((data) => {
    if (cb){
      cb(null, data.toString('base64'));
    }
  }));

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(10);

  let canvas = Canvas.createCanvas(options.width, options.height),
      ctx = canvas.getContext('2d'),
      img = new Image,
      centerX = options.width/2,
      centerY = options.height/2;

  for (var frame = 1; frame <= framesTotal; frame++){
    counter += counterIncrement;
    for (var i = 0; i < 20; i++){

      ctx.save();
      ctx.strokeStyle = colorForeground;        
      ctx.fillStyle = colorBackground;
      ctx.lineWidth = spiralThickness;

      // ctx.clearRect(0, 0, options.width, options.height);

      ctx.fillRect(0, 0, options.width, options.height);  

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);

      var STEPS_PER_ROTATION = 60;
      var increment = 2 * Math.PI / STEPS_PER_ROTATION;
      var theta = increment;

      while (theta < options.width/2 * Math.PI) {
        var new_x = centerX + (spiralThickness / 2) * theta * Math.cos(theta - counter);
        var new_y = centerY + (spiralThickness / 2) * theta * Math.sin(theta - counter);
        ctx.lineTo(new_x, new_y);
        theta = theta + increment;
      }

      ctx.stroke();
      ctx.restore();

      if (options.image){
        ctx.drawImage(img, options.width/2 - img.width/2, options.height/2 - img.height/2, img.width, img.height);      
      }

    }

    encoder.addFrame(ctx);    
    if (frame === framesTotal){
      encoder.setDelay(0);
    }
  }

  encoder.finish();
  console.log('gif finished...');
}
