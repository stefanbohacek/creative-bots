/*
  Based on https://www.cssscript.com/basic-snowflakes-falling-effect-javascript-canvas-snow-js/
*/

import Canvas from "canvas";
import GIFEncoder from "gifencoder";
import concat from "concat-stream";

import randomFromArray from "../random-from-array.js";
import getRandomInt from "../get-random-int.js";
import getRandomRange from "../get-random-range.js";

export default (options, cb) => {
  console.log("making it snow...");

  let width = options.width || 800;
  let height = options.height || 500;

  const data = [];
  const encoder = new GIFEncoder(width, height);
  const stream = encoder.createReadStream();

  encoder.createReadStream().pipe(
    concat((data) => {
      if (cb) {
        cb(null, data.toString("base64"));
      }
    })
  );

  encoder.start();
  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(30); // frame delay in milliseconds
  encoder.setQuality(10); // image quality, 10 is default.

  let canvas = Canvas.createCanvas(width, height);
  let ctx = canvas.getContext("2d");

  const skyColor = [
    "#061928",
    "#2c3e50",
    "#2980b9",
    "#34495e",
    "#5D8CAE",
    "#1B4F72",
    "#21618C",
    "#013243",
    "#2C3E50",
    "#044F67",
  ];

  let color = randomFromArray(skyColor);

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";

  let mf = getRandomInt(80, 210);
  let flakes = [];

  for (let i = 0; i < mf; i++) {
    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 5 + 2,
      d: Math.random() + 1,
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.beginPath();
    for (let i = 0; i < mf; i++) {
      let f = flakes[i];
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    move();
  };

  let angle = getRandomRange(-0.8, 0.8, 3);
  let direction = getRandomRange(-1, 1, 3);

  const move = () => {
    for (let i = 0; i < mf; i++) {
      let f = flakes[i];

      f.y += Math.pow(f.d, 2) + direction;
      f.x += angle;

      if (f.y > height) {
        flakes[i] = { x: Math.random() * width, y: 0, r: f.r, d: f.d };
      }
    }
  };

  for (let i = 0; i < 192; i++) {
    draw();
    encoder.addFrame(ctx);
  }

  encoder.finish();
  console.log("gif finished...");
};
