/*
  Based on https://codepen.io/motorlatitude/pen/nmqBeQ
*/

import Canvas from 'canvas';
import randomFromArray from  '../random-from-array.js';
import getRandomInt from  '../get-random-int.js';
import shadeColor from  '../shade-color.js';

class Progressbar {
  constructor(canvas, options) {
    console.log(options);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.height = options.height || 25;
    this.xPos = 75;
    this.yPos = this.canvas.height / 2 - this.height / 2;
    this.width = this.canvas.width - this.xPos * 2;
    this.color = options.color || "#0099db";
    this.background = options.background || "#c0cbdc";
    this.progress = options.progress
      ? this.width * (options.progress / 100)
      : 0;
    console.log(this);
  }

  draw() {
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#c0cbdc";
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(this.xPos, this.yPos, this.width, 25);
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.xPos, this.yPos, this.progress, 25);
  }
}

export default (options, cb) => {
  console.log('making a progressbar...', options);

  const canvasWidth = options.width || 800;
  const canvasHeight = options.height || 500;
  let canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
 
  const progress = 33;
  const bar = new Progressbar(canvas, options);

  bar.draw();

  if (cb){
    cb(null, canvas.toBuffer().toString('base64'));
  }
}
