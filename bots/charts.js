const request = require('request'),
      ChartjsNode = require('chartjs-node'),
      helpers = require(__dirname + '/../helpers/helpers.js'),
      cronSchedules = require(__dirname + '/../helpers/cron-schedules.js'),
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodonClient = require(__dirname + '/../helpers/mastodon.js'), 
      tumblrClient = require(__dirname + '/../helpers/tumblr.js');

const twitter = new TwitterClient({
  consumer_key: process.env.BOT_1_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TWITTER_CONSUMER_SECRET,
  access_token: process.env.BOT_1_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET
});

const mastodon = new mastodonClient({
   access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   api_url: process.env.BOT_1_MASTODON_API
});

const tumblr = new tumblrClient({
  tumblr_name: process.env.BOT_1_TUMBLR_BLOG_NAME,
  consumer_key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
  token: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN,
  token_secret: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET
});

module.exports = {
  active: false,
  name: 'Chart bot',
  description: 'A bot that makes charts.',
  interval: cronSchedules.EVERY_DAY_MORNING,
  script: () => {
    const datasetUrl = 'https://www.govtrack.us/api/v2/bill?order_by=-current_status_date',
          datasetName = 'Last 100 bills in the US government',
          datasetLabels = ['group', 'value'];

    request(datasetUrl, (error, response, body) => {
      let bodyParsed;

      try{
        bodyParsed = JSON.parse(body);
      } catch(err){
        console.log('ERROR: unable to parse data', err);
        return false;
      }

      if (bodyParsed){

        /* Set up your data.  */

        let introducedCount = 0,
            passOverHouseCount = 0,
            passedBillCount = 0,
            passedConcurrentResCount = 0,
            passedSimpleResCount = 0,
            reportedCount = 0,
            enactedSignedCount = 0;

        bodyParsed.objects.forEach((bill) => {
          if (bill.current_status === 'introduced'){
            introducedCount ++;
          } else if (bill.current_status === 'pass_over_house'){
            passOverHouseCount ++; 
          } else if (bill.current_status === 'passed_bill'){
            passedBillCount ++; 
          } else if (bill.current_status === 'passed_concurrentres'){
            passedConcurrentResCount ++; 
          } else if (bill.current_status === 'passed_simpleres'){
            passedSimpleResCount ++; 
          } else if (bill.current_status === 'reported'){
            reportedCount ++; 
          } else if (bill.current_status === 'enacted_signed'){
            enactedSignedCount ++; 
          }
        });  

       const data = [
            ['Introduced', introducedCount],
            ['Passed House', passOverHouseCount],
            ['Passed House & Senate', passedBillCount],
            ['Concurrent Resolution', passedConcurrentResCount],
            ['Simple Resolution', passedSimpleResCount],
            ['Ordered Reported', reportedCount],
            ['Enacted', enactedSignedCount]
        ];

        /* Set up the chart.js options, see chartjs.org for documentation. */

        const chartJsOptions = {
            plugins: {
              beforeDraw:  (chart, easing)  => {
                var ctx = chart.chart.ctx;
                ctx.save();
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
              }
            },
          
            type: 'bar',
            data: {
                labels: data.map((item) => {
                  return item[0];
                }),
                datasets: [{
                    label: datasetName,
                    data: data.map((item) => {
                      return item[1];
                    }),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        };

        let chartNode = new ChartjsNode(600, 600);

        chartNode.drawChart(chartJsOptions)
          .then(() => {
              return chartNode.getImageBuffer('image/png');
          })
          .then(buffer => {
              Array.isArray(buffer)

              const text = helpers.randomFromArray([
                'The last 100 bills in the US government, analyzed!',
                'Looking at the last 100 bills in the US government.',
                'The last 100 bills in one chart!',
                'Analyzing the last 100 bills in the US government.',
                'Breaking down the last 100 bills in the US government.'
              ]);

              const altText = `${ introducedCount } bills have been introduced, ${ passOverHouseCount } bills passed the House,  ${ passedBillCount } bills passed the House & the Senate, ${ passedConcurrentResCount + passedSimpleResCount } bills have been agreed to, ${ reportedCount } bills are being considered, and ${ enactedSignedCount } bills have been  enacted.`;
          
              const imgData = buffer.toString('base64');
          
              twitter.postImage({
                status:text,
                image: imgData,
                alt_text: altText
              });
          
              mastodon.postImage({
                status: text,
                image: imgData,
                alt_text: altText
              });
          
              tumblr.postImage(text, imgData);
          });   
      }
    });
  }
};
