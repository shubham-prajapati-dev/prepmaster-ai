import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDir, "../.env") });

// Load modules after dotenv so services can safely read environment variables.
const [{ default: app }, { connectDatabase }] = await Promise.all([
  import("./app.js"),
  import("./config/db.js"),
]);

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`PrepMaster API listening on http://localhost:${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down PrepMaster API...`);
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Server startup failed:", error?.message || error);
    process.exitCode = 1;
  }
}

await startServer();
