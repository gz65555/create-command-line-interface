"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = __importDefault(require("cac"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("./utils");
const questions = [
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
setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield (0, utils_1.getGitConfig)();
    // @ts-ignore
    questions[2].default = config.name;
    // @ts-ignore
    questions[3].default = config.email;
    const answers = yield inquirer_1.default.prompt(questions);
    const cwd = process.cwd();
    console.log(answers);
    const targetPath = path_1.default.join(cwd, answers.directory);
    (0, utils_1.createApp)(targetPath, answers);
}), 0);
const cli = (0, cac_1.default)();
const pkg = fs_extra_1.default.readJSONSync(path_1.default.join(__dirname, "../package.json"));
cli.help();
cli.version(pkg.version);
cli.parse();
