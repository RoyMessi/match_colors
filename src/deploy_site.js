import { exec } from "child_process";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envFile = path.resolve(".env.production");
if (!fs.existsSync(envFile)) {
  throw new Error("Env file is missing");
}

dotenv.config({ path: envFile });

const APP_VERSION = process.env.npm_package_version;
const DIR_BUILD = process.env.DIR_BUILD;
const DIR_GIT = ".git";
const DIR_BUILD_ABSOLUTE_PATH = path.resolve(DIR_BUILD);
const DIR_GIT_ABTOLUTE_PATH = path.join(DIR_BUILD_ABSOLUTE_PATH, DIR_GIT);
const GIT_URL = process.env.GIT_URL;
const GIT_SITE_BRANCH = process.env.GIT_SITE_BRANCH;

if (!fs.existsSync(DIR_BUILD_ABSOLUTE_PATH)) {
  throw new Error(`Build directory '${process.env.DIR_BUILD}' not found`);
}

if (fs.existsSync(path.join(DIR_BUILD_ABSOLUTE_PATH, ".dev_build"))) {
  throw new Error(`Cannot deploy development build`);
}

const files = fs.readdirSync(DIR_BUILD_ABSOLUTE_PATH);
if (files.length === 0) {
  throw new Error(`Build directory '${process.env.DIR_BUILD}' is empty`);
}

let commands = [
  `cd ${DIR_BUILD}`,
  "git init",
  `git branch -m ${GIT_SITE_BRANCH}`,
  "git add .",
  `git commit -m "Version: ${APP_VERSION}"`,
  `git remote add origin ${GIT_URL}`,
  `git push -f --set-upstream origin ${GIT_SITE_BRANCH}`,
  `rm -rf ${DIR_GIT_ABTOLUTE_PATH}`,
];

if (fs.existsSync(DIR_GIT_ABTOLUTE_PATH)) {
  commands.splice(1, 1, `rm -rf ${DIR_GIT_ABTOLUTE_PATH}`);
}

exec(commands.join(" && "), (error, stdout, stderr) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  if (stderr) {
    console.error(stderr);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
