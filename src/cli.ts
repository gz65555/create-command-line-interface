import cac from "cac";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import { createApp, getGitConfig } from "./utils";

const questions: inquirer.QuestionCollection<any>[] = [
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
  },
  {
    type: "input",
    name: "cmdname",
    message: "Input Command Line Name",
    default: "test-cmd"
  }
];

setTimeout(async () => {
  const config = await getGitConfig();
  // @ts-ignore
  questions[2].default = config.name;
  // @ts-ignore
  questions[3].default = config.email;
  const answers = await inquirer.prompt(questions);
  const cwd = process.cwd();
  console.log(answers);
  const targetPath = path.join(cwd, answers.directory);
  createApp(targetPath, answers);
}, 0);

const cli = cac();

const pkg = fs.readJSONSync(path.join(__dirname, "../package.json"));
cli.help();
cli.version(pkg.version);
cli.parse();
