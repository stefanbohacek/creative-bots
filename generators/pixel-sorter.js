/*
  Based on https://github.com/dustinbarnes/pixel-sorting
*/

var fs = require('fs'),
    png = require('pngjs').PNG,
    path = require('path'),
    img_path_png = './.data/temp.png',
    img_path_gif = './.data/temp.gif',    
    pixel_sorter = {
      invert: require(__dirname + '/../.pixel-sorting/lib/invert.js'),
      blackAndWhite: require(__dirname + '/../.pixel-sorting/lib/black-and-white.js'),
      pixelSortBlack: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-black.js'),
      pixelSortBlackHoriz: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-black-horiz.js'),
      pixelSortBlackVert: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-black-vert.js'),
      pixelSortWhite: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-white.js'),
      pixelSortBrightness: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-brightness.js'),
      pixelSortGreenChannel: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-green-channel.js'),
      pixelSortRedChannel: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-red-channel.js'),
      pixelSortBlueChannel: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-blue-channel.js'),
      redBlueSwitch: require(__dirname + '/../.pixel-sorting/lib/red-blue-switch.js'),
      redGreenSwitch: require(__dirname + '/../.pixel-sorting/lib/red-green-switch.js'),
      blueGreenSwitch: require(__dirname + '/../.pixel-sorting/lib/blue-green-switch.js'),
      purePixelSort: require(__dirname + '/../.pixel-sorting/lib/pure-pixel-sort.js'),
      purePixelSortVertical: require(__dirname + '/../.pixel-sorting/lib/pure-pixel-sort-vertical.js'),
      purePixelSortHorizontal: require(__dirname + '/../.pixel-sorting/lib/pure-pixel-sort-horizontal.js'),
      pixelSortGrayout: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-grayout.js'),
      pixelSortBlackHi: require(__dirname + '/../.pixel-sorting/lib/pixel-sort-black-hi.js'),
      //normalizeBrightness: require(__dirname + '/../.pixel-sorting/lib/normalize-brightness.js')
    }, 
    helpers = require(__dirname + '/../helpers.js');

module.exports = function(img_data, cb){
  console.log('sorting pixels...');

  fs.writeFile(img_path_png, img_data, 'base64', function(err) {
    fs.createReadStream(img_path_png)
      .pipe(new png({
          checkCRC: false
      }))
      .on('parsed', function() {
        var image = this;
        // pixel_sorter.pixelSortBlackHoriz.draw(image);
        // pixel_sorter.invert.draw(image);
        // pixel_sorter.blackAndWhite.draw(image);
        // pixel_sorter.pixelSortBlack.draw(image);
        // pixel_sorter.pixelSortBlackHoriz.draw(image);
        // pixel_sorter.pixelSortBlackVert.draw(image);
        pixel_sorter.pixelSortWhite.draw(image);
        // pixel_sorter.pixelSortBrightness.draw(image);
        // pixel_sorter.pixelSortGreenChannel.draw(image);
        pixel_sorter.pixelSortRedChannel.draw(image);
        // pixel_sorter.pixelSortBlueChannel.draw(image);
        // pixel_sorter.redBlueSwitch.draw(image);
        // pixel_sorter.redGreenSwitch.draw(image);
        // pixel_sorter.blueGreenSwitch.draw(image);
        // pixel_sorter.purePixelSort.draw(image);
        // pixel_sorter.purePixelSortVertical.draw(image);
        // pixel_sorter.purePixelSortHorizontal.draw(image);
        // pixel_sorter.pixelSortGrayout.draw(image);
        pixel_sorter.pixelSortBlackHi.draw(image);

        this.pack().pipe(fs.createWriteStream(img_path_png).on('finish', function(){
          var img_data = fs.readFileSync(img_path_png, { encoding: 'base64' });
          cb(null, {
            path: img_path_png,
            data: img_data
          });
        }));
      });
  });
}