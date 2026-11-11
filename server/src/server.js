import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(currentDir, "../.env"),
});

const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PrepMaster API listening on http://localhost:${PORT}`);
});