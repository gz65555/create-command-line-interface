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
exports.getGitConfig = exports.createApp = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const os_1 = __importDefault(require("os"));
const art_template_1 = __importDefault(require("art-template"));
const readline_1 = __importDefault(require("readline"));
const templateDir = path_1.default.join(__dirname, "..", "template");
function createApp(targetPath, answers) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.default.copy(templateDir, targetPath);
        const result = (0, art_template_1.default)(path_1.default.join(targetPath, "_package.json"), answers);
        fs_extra_1.default.writeFile(path_1.default.join(targetPath, "package.json"), result, { encoding: "utf-8" });
        fs_extra_1.default.remove(path_1.default.join(targetPath, "_package.json"));
    });
}
exports.createApp = createApp;
function getGitConfig() {
    return new Promise((resolve) => {
        let configPath = "";
        const config = {};
        const local = path_1.default.join(process.cwd(), ".git/config");
        const global = path_1.default.join(os_1.default.homedir(), ".gitconfig");
        if (fs_extra_1.default.existsSync(local)) {
            configPath = local;
        }
        else {
            configPath = fs_extra_1.default.existsSync(global) ? global : path_1.default.join(os_1.default.homedir(), ".config/git/config");
        }
        if (!fs_extra_1.default.existsSync(configPath)) {
            return resolve(config);
        }
        const fileStream = fs_extra_1.default.createReadStream(configPath);
        const rl = readline_1.default.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let flag = false;
        rl.on("line", (line) => {
            if (!line.startsWith("[")) {
                if (flag === true) {
                    const data = line.split("=");
                    config[data[0].trim()] = data[1].trim();
                }
            }
            else {
                if (line.indexOf("[user]") >= 0) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
        });
        rl.once("close", () => {
            resolve(config);
        });
    });
}
exports.getGitConfig = getGitConfig;
