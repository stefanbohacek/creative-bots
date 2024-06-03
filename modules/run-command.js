import {exec} from "node:child_process";
import util from "node:util";

const execPromise = util.promisify(exec);

const runCommand = async (command, args) => {
    const response = await execPromise(`${command} ${args.join(' ')}`);
    console.log(response.stdout, response.stderr);
};

export default runCommand;
