const fs = require('fs'),
      path = require('path'),
      fetch = require('node-fetch'),
      request = require('request'),
      exec  = require('child_process');

module.exports = {
  capitalizeFirstLetter: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();    
  },
  randomFromArray: (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]; 
  },
  randomFromArrayUnique: (arr, n) => {
    let len = arr.length;

    if (n > len){
      n = len;
    }

    let result = new Array(n),
        taken = new Array(len);

    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  },  
  getRandomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  getRandomRange: (min, max, fixed) => {
    return (Math.random() * (max - min) + min).toFixed(fixed) * 1;
  },
  getRandomHex: () => {
    return '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
  },
  shadeColor: (color, percent) => {
    // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    let f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return `#${(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1)}`;
  },
  invertColor: (hex) => {
    /* https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color */
    const padZero = (str, len) => {
      len = len || 2;
      var zeros = new Array(len).join('0');
      return (zeros + str).slice(-len);
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return '#' + padZero(r) + padZero(g) + padZero(b);
  },  
  loadAssets: (cb) => {
    console.log('reading assets folder...')
    let that = this;
    fs.readFile('./.glitch-assets', 'utf8',  (err, data)  => {
      if (err) {
        console.log('error:', err);
        cb(err);
        return false;
      }
      cb(null, data);
    });      
  },
  loadImageAssets: (cb) => {
    let helpers = this;

    helpers.loadAssets((err, data) => {
      /* Filter images in the assets folder */
      data = data.split('\n');

      let dataJson = JSON.parse('[' + data.join(',').slice(0, -1) + ']');
      
      let deletedImages = dataJson.reduce((filtered, dataImg)  => {
            if (dataImg.deleted) {
               let someNewValue = { name: dataImg.name, newProperty: 'Foo' }
               filtered.push(dataImg.uuid);
            }
            return filtered;
          }, []),
          imgUrls = [];
    
        for (let i = 0, j = data.length; i < j; i++){
          if (data[i].length){
            let imgData = JSON.parse(data[i]),
                imgUrl = imgData.url;
  
            if (imgUrl && deletedImages.indexOf(imgData.uuid) === -1 && helpers.extensionCheck(imgUrl)){
              let fileName = helpers.getFilenameFromURL(imgUrl).split('%2F')[1];
              console.log(`- ${fileName}`);
              imgUrls.push(imgUrl);
            }
          }
        }
        if (imgUrls && imgUrls.length === 0){
          console.log('no images found...');
        }
        cb(null, imgUrls);
    });
  },
  extensionCheck: (url) => {
    let fileExtension = path.extname(url).toLowerCase(),
        extensions = ['.png', '.jpg', '.jpeg', '.gif'];
    return extensions.indexOf(fileExtension) !== -1;
  },
  getFilenameFromURL: (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  },
  loadImage: (url, cb) => {
    console.log('loading remote image...', url);
    request({ url: url, encoding: null },  (err, res, body)  => {
        if (!err && res.statusCode == 200) {
          let b64content = 'data:' + res.headers['content-type'] + ';base64,';
          console.log('image loaded...');
          cb(null, body.toString('base64'));
        } else {
          console.log('ERROR:', err);
          cb(err);
        }
    });
  },
  removeAsset: (url, cb) => {
    let helpers = this;
    console.log('removing asset...');
    helpers.loadAssets((err, data) => {
      let dataArray = data.split('\n'),
          imgData;
      dataArray.forEach((d) => {
        if (d.indexOf(url) > -1){
            imgData = JSON.parse(d);
            return;
        }
      });

      data += `{"uuid":"${imgData.uuid}","deleted":true}\n`;
      fs.writeFile( './.glitch-assets', data);
      exec.exec('refresh');
    });
  },
  downloadFile: (uri, cb) => {
    // request.head(uri, (err, res, body) => {
    //   request(uri).pipe(fs.createWriteStream(filename)).on('close', cb);
    // });
    
    try {
        fetch(uri)
            .then(res => res.buffer())
            .then(buffer => {
              console.log(buffer)
              if (cb){
                cb(null, buffer);
              }
        });
    } catch (err) {
        console.log(err);
    }

  },
  removeFile: (filePath) => {
    setTimeout(() => {
      if (fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
      }
    }, 30000);
  }
};
