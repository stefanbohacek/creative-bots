var fs = require('fs'),
    Canvas = require('canvas'),
    GIFEncoder = require('gifencoder'),
    img_path_png = './.data/temp.png',
    img_path_gif = './.data/temp.gif',
    helpers = require(__dirname + '/../helpers.js');

module.exports = function(options, cb) {
  /* 
    Based on https://generativeartistry.com/tutorials/circle-packing/
  */
  console.log('packing circles...');

  var width = options.width || 1184,
      height = options.height || 506,
      size = width,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext('2d');
  
  if (options.animate){
    var encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(fs.createWriteStream(img_path_gif));

    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(100);   // frame delay in milliseconds
    encoder.setQuality(10); // image quality, 10 is default.
  }

  ctx.lineWidth = helpers.get_random_int(1,4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (options.animate){
    encoder.addFrame(ctx);
  }

  var circles = [];
  var minRadius = 2;
  var maxRadius = 100;
  var totalCircles = 500;
  
  if (options.animated === true){
    // totalCircles = 250;
    totalCircles = 230;
  }    
  var createCircleAttempts = 500;

  function doesCircleHaveACollision(circle) {
    for(var i = 0; i < circles.length; i++) {
      var otherCircle = circles[i];
      var a = circle.radius + otherCircle.radius;
      var x = circle.x - otherCircle.x;
      var y = circle.y - otherCircle.y;

      if (a >= Math.sqrt((x*x) + (y*y))) {
        return true;
      }
    }

    if ( circle.x + circle.radius >= size ||
       circle.x - circle.radius <= 0 ) {
      return true;
    }

    if (circle.y + circle.radius >= size ||
        circle.y-circle.radius <= 0 ) {
      return true;
    }

    return false;
  }

  function createAndDrawCircle() {

    var newCircle;
    var circleSafeToDraw = false;
    for( var tries = 0; tries < createCircleAttempts; tries++) {
      newCircle = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
        radius: minRadius
      }

      if(doesCircleHaveACollision(newCircle)) {
        continue;
      } else {
        circleSafeToDraw = true;
        break;
      }
    }

    if(!circleSafeToDraw) {
      return;
    }

    for(var radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
      newCircle.radius = radiusSize;
      if(doesCircleHaveACollision(newCircle)){
        newCircle.radius--
        break;
      } 
    }

    circles.push(newCircle);
    ctx.beginPath();
    ctx.arc(newCircle.x, newCircle.y, newCircle.radius, 0, 2*Math.PI);
    ctx.stroke(); 
  }



  for( var i = 0; i < totalCircles; i++ ) {  
    createAndDrawCircle();
    if (options.animate){
      encoder.addFrame(ctx);
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
