import { cac } from "cac";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import chalk from "chalk";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const questions: inquirer.QuestionCollection[] = [
  {
    type: "input",
    name: "directory",
    message: "Input Package Directory",
    default: "."
  },
  {
    type: "input",
    name: "name",
    message: "Input Package Name",
    default: "test-cli"
  },
  {
    type: "input",
    name: "username",
    message: "Input Author Name",
    default: null
  },
  {
    type: "input",
    name: "email",
    message: "Input Author Email",
    default: null
  }
];

setTimeout(async () => {
  const answers = await inquirer.prompt(questions);
  console.log(chalk.bgRed("Your answer is: "));
  console.log(answers);
}, 0);

const cli = cac();

const pkg = fs.readJSONSync(path.join(__dirname, "../package.json"));
cli.help();
cli.version(pkg.version);
cli.parse();
