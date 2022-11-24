const fs = require('fs'),
      path = require('path'),
      Canvas = require('canvas'),
      GIFEncoder = require('gifencoder'),
      glitch = require('../node_modules/glitch-canvas/dist/glitch-canvas-node.js'),
      imgPathGif = './.data/temp.gif',
      helpers = require(__dirname + '/../helpers/helpers.js');

const glitchImageStatic = (options, cb) => {
    /* Apply a glitch effect to an image. */
    let width = options.width || 1200,
        height = options.height || 500,
        imgPath = `./.data/${helpers.getFilenameFromURL(options.url)}`;
       
    helpers.downloadFile(options.url, imgPath , () => {
      console.log(`downloading to ${imgPath}...`);

      fs.readFile(imgPath, (err, buffer) => {
        if (err) {
          return false;
        }

        let canvas = Canvas.createCanvas(width, height),
            ctx = canvas.getContext('2d'),
            Image = Canvas.Image;

        let img = new Image;
            img.src = imgPath;

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

        let randomSeed = Math.round(Math.random() * 100),
            randomQuality = Math.round(Math.random() * 100);

        glitch({ seed: randomSeed, quality: randomQuality })
          .fromBuffer(buffer)
          .toDataURL()
          .then((dataURL) => {
            console.log('fromBufferToDataURL complete. Length of dataURL:', dataURL.length);

            let glitchedImg = new Image();
                glitchedImg.src = dataURL;

            ctx.drawImage(glitchedImg, 0, 0, glitchedImg.width, glitchedImg.height, 0, 0, canvas.width, canvas.height);

            const out = fs.createWriteStream(imgPath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);

            out.on('finish', () => {
              if (cb){
                cb(null, {
                  path: imgPath,
                  data: canvas.toBuffer().toString('base64')
                });
              }
            });          
        
          }, (err) => {
            throw err;
        });
      });
    });
  
}

const glitchImageAnimated = (options, cb) => {

    /* Create a glitchy gif */

    let imgURL = options.img_url,
        width = options.width || 320,
        height = options.height || 240,
        frameCount = options.frameCount || 48;
    
    const getRandomGlitchParams = () => {
      /*
        Note: some values can cause the script to crash ¯\_(ツ)_/¯
      */
      return {
        seed: helpers.getRandomInt(0, 99), // orginally an integer between 0 and 99 - default 20
        quality: helpers.getRandomInt(0, 99), // orginally an integer between 0 and 99 - default 30
        amount: helpers.getRandomInt(0, 99), // orginally an integer between 0 and 99 - default 35
        iterations: 20 // orginally an integer - default 20
      };
    }
    
    const generateGlitchedImageData = (frameCount, buffer) => {
      let glitchPromses = [ ];

      for (let i = 0; i < frameCount; ++i) {
        glitchPromses[i] = glitch(getRandomGlitchParams())
        .fromBuffer(buffer)
        .toDataURL();
      }

      return Promise.all(glitchPromses);
    }

    let imgPath = `./.data/${helpers.getFilenameFromURL(options.url)}`;

    helpers.downloadFile(options.url, imgPath , () => {
      console.log(`downloading to ${imgPath}...`);

      fs.readFile(imgPath, (err, buffer) => {
        if (err) {
          return false;
        }

        let canvas = Canvas.createCanvas(width, height),
          ctx = canvas.getContext('2d'),
          Image = Canvas.Image;

        let img = new Image;
            img.src = imgPath;

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

    
        generateGlitchedImageData(frameCount, buffer).then((frames) => {

          console.log('creating gif...');

          let encoder = new GIFEncoder(width, height);

          encoder.createReadStream().pipe(fs.createWriteStream(imgPathGif));

          encoder.start();
          encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
          encoder.setDelay(100);  // frame delay in ms
          encoder.setQuality(10); // image quality. 10 is default.

          let canvas = Canvas.createCanvas(width, height);
          let ctx = canvas.getContext('2d');

          let color = helpers.getRandomHex();

          for (let i = 0, j = frames.length; i < j; i++){
            encoder.setDelay(helpers.getRandomInt(10, 250));  // frame delay in ms

            let glitchedImg = new Image();
                glitchedImg.src = frames[i];
            
            ctx.drawImage(glitchedImg, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
            encoder.addFrame(ctx);
          }

          encoder.finish();
          console.log('gif finished...');

          /* TODO: For some reason this doesn't work and we need to download the image again...  */
          // let b64content = fs.readFileSync(__dirname + '/temp.gif', { encoding: 'base64' });
          // cb(null, b64content);

          helpers.loadImage(`https://${process.env.PROJECT_DOMAIN}.glitch.me/gif`, (err, imgData) => {
     
            const out = fs.createWriteStream(imgPath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);

            out.on('finish', () => {
              if (cb){
                cb(null, imgData);
              }
            });
          });
        });   
      });
    });
  
}

module.exports = (options, cb) => {
  if (options.animated){
    glitchImageAnimated(options, cb);
  }
  else{
    glitchImageStatic(options, cb);
  }
}
