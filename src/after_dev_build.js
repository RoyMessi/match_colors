import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envFile = path.resolve(".env.development");
if (!fs.existsSync(envFile)) {
  throw new Error("Env file is missing");
}

dotenv.config({ path: envFile });

const DIR_BUILD = process.env.DIR_BUILD;
const DIR_BUILD_ABSOLUTE_PATH = path.resolve(DIR_BUILD);
fs.writeFileSync(path.join(DIR_BUILD_ABSOLUTE_PATH, ".dev_build"), "");
