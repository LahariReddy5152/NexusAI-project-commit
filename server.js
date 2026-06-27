import { startServer } from "./server/start.js";

const PORT = process.env.PORT || 5000;

startServer({ port: PORT, host: "0.0.0.0" })
  .then(({ port }) => {
    console.log(`NexusAI server running on http://localhost:${port}`);
    console.log(`API docs: http://localhost:${port}/api/docs`);
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
