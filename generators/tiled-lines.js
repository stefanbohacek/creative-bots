var fs = require('fs'),
    Canvas = require('canvas'),
    GIFEncoder = require('gifencoder'),
    img_path_png = './.data/temp.png',
    img_path_gif = './.data/temp.gif',
    helpers = require(__dirname + '/../helpers.js');

module.exports = function(options, cb) {
  /* 
    Based on http://generativeartistry.com/tutorials/tiled-lines/
  */
  console.log('drawing lines...');
  var width = options.width || 1184,
      height = options.height || 506,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext('2d');

  if (options.animate){
    var encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(fs.createWriteStream(img_path_gif));

    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(200);   // frame delay in milliseconds
    encoder.setQuality(10); // image quality, 10 is default.
  }

  ctx.lineWidth = helpers.get_random_int(1,4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (options.animate){
    encoder.addFrame(ctx);
  }

  var step = helpers.get_random_int(15,25);

  function draw(x, y, width, height) {
    var leftToRight = Math.random() >= 0.5;

    if( leftToRight ) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);    
    } else {
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y + height);
    }

    ctx.stroke();
  }

  for( var x = 0; x < width; x += step) {
    for( var y = 0; y < height; y+= step ) {
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
  else{
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
}
