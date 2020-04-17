/*
  Based on https://codepen.io/ruigewaard/pen/JHDdF
*/

var fs = require('fs'),
    Canvas = require('canvas'),
    GIFEncoder = require('gifencoder'),
    img_path_png = './.data/temp.png',
    img_path_gif = './.data/temp.gif',
    helpers = require(__dirname + '/../helpers.js');

module.exports = function(options, cb){
  console.log('making it rain...');

  var width = options.width || 800;
  var height = options.height || 500;

  var encoder = new GIFEncoder(width, height);

  encoder.createReadStream().pipe(fs.createWriteStream(img_path_gif));

  encoder.start();
  encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
  encoder.setDelay(30);   // frame delay in milliseconds
  encoder.setQuality(10); // image quality, 10 is default.

  var canvas = Canvas.createCanvas(width, height);
  var ctx = canvas.getContext('2d');

  var sky_color = [
    '#061928',
    '#2c3e50',
    '#2980b9',
    '#34495e',
    '#5D8CAE',
    '#1B4F72',
    '#21618C',
    '#013243',
    '#2C3E50',
    '#044F67'
  ];

  var color = helpers.random_from_array(sky_color);

  //ctx.strokeStyle = 'rgba(174,194,224,0.5)';
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';


  var init = [];
  var maxParts = helpers.get_random_int(50, 100);
  for(var a = 0; a < maxParts; a++) {
    init.push({
      x: Math.random() * width,
      y: Math.random() * height,
      l: Math.random() * 1/maxParts*200,
      xs: -4 + Math.random() * 4 + 5,
      ys: Math.random() * helpers.get_random_int(10, 30) + helpers.get_random_int(10, 30)
    })
  }

  var particles = [];
  for(var b = 0; b < maxParts; b++) {
    particles[b] = init[b];
  }

  function draw() {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    for(var c = 0; c < particles.length; c++) {
      var p = particles[c];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      ctx.stroke();
    }
    move();
  }

  function move() {
    for(var b = 0; b < particles.length; b++) {
      var p = particles[b];
      p.x += p.xs;
      p.y += p.ys;
      if(p.x > width || p.y > height) {
        p.x = Math.random() * width;
        p.y = -20;
      }
    }
  }

  for (var i = 0; i < 48; i++){
    draw();
    encoder.addFrame(ctx);
  }

  encoder.finish();
  console.log('gif finished...');

  /* TODO: For some reason this doesn't work and we need to download the image again...  */
  // var b64content = fs.readFileSync(__dirname + '/temp.gif', { encoding: 'base64' });
  // cb(null, b64content);

  helpers.load_image(`https://${process.env.PROJECT_DOMAIN}.glitch.me/gif`,
  function(err, img_data_gif){
    if (cb){
      cb(null, {
        path: img_path_gif,
        data: img_data_gif
      });          
    }
  });
}
