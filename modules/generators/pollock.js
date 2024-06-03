/*
  Based on https://codepen.io/ruigewaard/pen/JHDdF
*/

import Canvas from 'canvas';
import GIFEncoder from 'gifencoder';
import concat from 'concat-stream';

import randomFromArray from  '../random-from-array.js';
import getRandomInt from  '../get-random-int.js';
import shadeColor from  '../shade-color.js';

export default (options, cb) => {
  console.log('making art...');

  let width = options.width || 800;
  let height = options.height || 500;
  let imgDataStatic;

  const encoder = new GIFEncoder(width, height);

  encoder.createReadStream().pipe(concat((data) => {
    if (cb){
      cb(null, data.toString('base64'), imgDataStatic);
    }
  }));

  encoder.start();
  encoder.setRepeat(-1);
  encoder.setDelay(500);
  encoder.setQuality(10);


  let canvas = Canvas.createCanvas(width, height);
  let ctx = canvas.getContext('2d');

  const palette = [
    '#D89CA9',
    '#1962A0',
    '#F1ECD7',
    '#E8C051',
    '#1A1C23'
  ];
  
  let color = randomFromArray(palette);

  ctx.strokeStyle = color;
  ctx.fillStyle = '#fff';
  ctx.fillStyle = shadeColor(color, 0.95);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  encoder.addFrame(ctx);
  
  let startPosition = {
      x: getRandomInt(0, width),
      y: getRandomInt(0, height)
  },
  endPosition = {
      x: getRandomInt(0, width),
      y: getRandomInt(0, height)
  };

  ctx.lineCap='round';
  ctx.lineJoin='round';

  const makeSplat = (start, end, size) => {
    const center = {
      x: getRandomInt(start.x, end.x),
      y: getRandomInt(start.y, end.y)
    },
    splatCount = getRandomInt(1, 10);

    for (let i = 0; i <= splatCount; i++){
      ctx.beginPath();
      ctx.arc(
        center.x + getRandomInt(0, 4),
        center.y + getRandomInt(0, 4),
        getRandomInt(0, 4),
        0,
        2*Math.PI);
      ctx.fill();        
    }
  }

  const makeLine = (start, end, size) => {
    if (!size){
      const speed = getRandomInt(0, 100);

      if (speed < 2){
          size = getRandomInt(8,12);
      }
      else if (speed < 4){
          size = getRandomInt(6,7);
      }
      else if (speed < 7){
          size = getRandomInt(4,5);
      }
      else if (speed < 10){
          size = getRandomInt(1,3);
      }
      else{
          size = 1;
      }
    };
  
    if (getRandomInt(0, getRandomInt(3, 20)) === 0){
      color = randomFromArray(palette);
    }      
  
    ctx.strokeStyle = shadeColor(color, getRandomInt(99, 100));
    ctx.lineWidth = size;

    ctx.moveTo(startPosition.x, startPosition.y);

    if (getRandomInt(0, 10) === 1){
      ctx.lineTo(endPosition.x, endPosition.y);
    }
    else{
      ctx.bezierCurveTo(startPosition.x, startPosition.y,
                        getRandomInt(startPosition.x, endPosition.x),
                        getRandomInt(startPosition.y, endPosition.y),
                        endPosition.x, endPosition.y);

    }
    ctx.stroke();
    makeSplat(startPosition, endPosition);
  }

  const numberOfLines = getRandomInt(20, 40);

  for (let i = 0; i <= numberOfLines; i++){
      makeLine(startPosition.x, startPosition.y);
      encoder.addFrame(ctx);
      startPosition.x = endPosition.x;
      startPosition.y = endPosition.y;
      endPosition = {
          x: getRandomInt(0, width),
          y: getRandomInt(0, height)
      };        
  }

  encoder.setDelay(2000);
  encoder.addFrame(ctx);

  encoder.finish();
  imgDataStatic = canvas.toBuffer().toString('base64');

  console.log('painting finished...');
}
