import { createApp } from "./app.js";

export function startServer(options = {}) {
  const host = options.host ?? "127.0.0.1";
  const requestedPort = options.port ?? process.env.PORT ?? 0;
  const app = createApp(options);

  return new Promise((resolve, reject) => {
    const server = app.listen(requestedPort, host, () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : requestedPort;
      resolve({ app, server, port, host });
    });
    server.on("error", reject);
  });
}
