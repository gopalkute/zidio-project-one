import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);

export const __rootdir = resolve(filename, '../', '../', '../');