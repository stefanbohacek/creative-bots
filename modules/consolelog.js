import util from "util";

const consoleLog = (obj) => {
  console.log(util.inspect(obj, false, null, true));  
}

export default consoleLog;
