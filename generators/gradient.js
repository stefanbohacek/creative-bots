var fs = require('fs'),
    Canvas = require('canvas'),
    img_path_png = './.data/temp.png',
    helpers = require(__dirname + '/../helpers.js');

module.exports = function(options, cb) {
  /* 
    Random gradient generator. See more examples at https://github.com/Automattic/node-canvas/tree/master/examples.
  */
  var width = options.width || 1200,
      height = options.height || 500;

  console.log('making gradient...');
  var canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext("2d");

  var lingrad = ctx.createLinearGradient(helpers.get_random_int(0, height), helpers.get_random_int(0, height), helpers.get_random_int(0, width), helpers.get_random_int(0, width))

  var colors = [];
  for (var i = 0; i<3; i++){
      if (options.colors.length >= i+1){
          colors.push(`#${options.colors[i]}`);
      }
      else{
          colors.push(helpers.get_random_hex());
      }
  }

  lingrad.addColorStop(0, colors[0]);
  lingrad.addColorStop(0.5, colors[1]);
  lingrad.addColorStop(1, colors[2]);
  
  ctx.fillStyle = lingrad;
  ctx.fillRect(0, 0, width, height);

  const out = fs.createWriteStream(img_path_png);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on('finish', function(){
    if (cb){
      cb(null, {
        path: img_path_png,
        data: canvas.toBuffer().toString('base64')
      });
    }
  });    
}