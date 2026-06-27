import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import apiRouter from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp(options = {}) {
  const app = express();
  const staticRoot = options.staticRoot || path.join(__dirname, "..");

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  const openapiPath = path.join(__dirname, "openapi.yaml");
  if (fs.existsSync(openapiPath)) {
    const spec = fs.readFileSync(openapiPath, "utf8");
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(undefined, { swaggerOptions: { url: "/api/openapi.yaml" } }));
    app.get("/api/openapi.yaml", (_req, res) => {
      res.type("text/yaml").send(spec);
    });
  }

  app.use("/api", apiRouter);

  // Legacy auth endpoints
  app.post("/auth/signup", (req, res, next) => {
    req.url = "/auth/signup";
    apiRouter.handle(req, res, next);
  });
  app.post("/auth/login", (req, res, next) => {
    req.url = "/auth/login";
    apiRouter.handle(req, res, next);
  });

  app.use(express.static(staticRoot));

  return app;
}
