import path from "path";
import fs from "fs-extra";
import os from "os";
import template from "art-template";
import readline from "readline";

const templateDir = path.join(__dirname, "..", "template");
export async function createApp(targetPath: string, answers: any) {
  await fs.copy(templateDir, targetPath);
  const result = template(path.join(targetPath, "_package.json"), answers);
  fs.writeFile(path.join(targetPath, "package.json"), result, { encoding: "utf-8" });
  fs.remove(path.join(targetPath, "_package.json"));
}

export function getGitConfig(): Promise<Record<string, string>> {
  return new Promise((resolve) => {
    let configPath = "";
    const config = {};

    const local = path.join(process.cwd(), ".git/config");
    const global = path.join(os.homedir(), ".gitconfig");

    if (fs.existsSync(local)) {
      configPath = local;
    } else {
      configPath = fs.existsSync(global) ? global : path.join(os.homedir(), ".config/git/config");
    }

    if (!fs.existsSync(configPath)) {
      return resolve(config);
    }

    const fileStream = fs.createReadStream(configPath);
    const rl = readline.createInterface({
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
      } else {
        if (line.indexOf("[user]") >= 0) {
          flag = true;
        } else {
          flag = false;
        }
      }
    });

    rl.once("close", () => {
      resolve(config);
    });
  });
}
