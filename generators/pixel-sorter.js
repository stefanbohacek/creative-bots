/*
  Based on https://github.com/dustinbarnes/pixel-sorting
*/

const fs = require('fs'),
      png = require('pngjs').PNG,
      path = require('path'),
      imgPathPNG = './.data/temp.png',
      pixelSorter = {
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
      helpers = require(__dirname + '/../helpers/helpers.js');

module.exports = (imgData, cb) => {
  console.log('sorting pixels...');

  fs.writeFile(imgPathPNG, imgData, 'base64', (err) => {
    fs.createReadStream(imgPathPNG)
      .pipe(new png({
          checkCRC: false
      }))
      .on('parsed', () => {
        var image = this;
        // pixelSorter.pixelSortBlackHoriz.draw(image);
        // pixelSorter.invert.draw(image);
        // pixelSorter.blackAndWhite.draw(image);
        // pixelSorter.pixelSortBlack.draw(image);
        // pixelSorter.pixelSortBlackHoriz.draw(image);
        // pixelSorter.pixelSortBlackVert.draw(image);
        pixelSorter.pixelSortWhite.draw(image);
        // pixelSorter.pixelSortBrightness.draw(image);
        // pixelSorter.pixelSortGreenChannel.draw(image);
        pixelSorter.pixelSortRedChannel.draw(image);
        // pixelSorter.pixelSortBlueChannel.draw(image);
        // pixelSorter.redBlueSwitch.draw(image);
        // pixelSorter.redGreenSwitch.draw(image);
        // pixelSorter.blueGreenSwitch.draw(image);
        // pixelSorter.purePixelSort.draw(image);
        // pixelSorter.purePixelSortVertical.draw(image);
        // pixelSorter.purePixelSortHorizontal.draw(image);
        // pixelSorter.pixelSortGrayout.draw(image);
        pixelSorter.pixelSortBlackHi.draw(image);

        this.pack().pipe(fs.createWriteStream(imgPathPNG).on('finish', () => {
          var imgData = fs.readFileSync(imgPathPNG, { encoding: 'base64' });
          cb(null, imgData);
        }));
      });
  });
}