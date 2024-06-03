// time is in UTC, subtract 5 hours for EST
// '0 8 * * *' would be every day at 8-5 = 3am

const schedules = {
  EVERY_SECOND: '*/1 * * * * *',
  EVERY_FIVE_SECONDS: '*/5 * * * * *',
  EVERY_TEN_SECONDS: '*/10 * * * * *',  
  EVERY_FIFTEEN_SECONDS: '*/15 * * * * *',
  EVERY_THIRTY_SECONDS: '*/30 * * * * *',
  EVERY_MINUTE: '* * * * *',
  EVERY_FIVE_MINUTES: '*/5 * * * *',
  EVERY_TEN_MINUTES: '*/10 * * * *',
  EVERY_THIRTY_MINUTES: '*/30 * * * *',
  EVERY_HOUR: '0 */1 * * *',
  EVERY_TWO_HOURS: '0 */2 * * *',
  EVERY_THREE_HOURS: '0 */3 * * *',
  EVERY_FOUR_HOURS: '0 */4 * * *',
  EVERY_SIX_HOURS: '15 */6 * * *',
  EVERY_TWELVE_HOURS: '1 */12 * * *',
  EVERY_DAY_MIDNIGHT: '0 0 * * *',
  EVERY_DAY_MORNING: '0 10 * * *',
  EVERY_DAY_NOON: '0 17 * * *',
  EVERY_DAY_AFTERNOON: '0 19 * * *',
  EVERY_DAY_EVENING: '0 0 * * *'
};

// const schedules = {
//   EVERY_HOUR: '*/15 * * * * *',
//   EVERY_TWO_HOURS: '*/10 * * * * *',  
//   EVERY_THREE_HOURS: '*/15 * * * * *',
//   EVERY_FOUR_HOURS: '*/30 * * * * *',
//   EVERY_SIX_HOURS: '* * * * *',
//   EVERY_TWELVE_HOURS: '*/5 * * * *',
//   EVERY_DAY_MIDNIGHT: '*/5 * * * *',
//   EVERY_DAY_MORNING: '*/5 * * * *',
//   EVERY_DAY_NOON: '*/5 * * * *',
//   EVERY_DAY_AFTERNOON: '*/5 * * * *',
//   EVERY_DAY_EVENING: '*/5 * * * *'
// };

export default schedules;
