import express from "express";
import cors from "cors";
import path from "path";
import { config } from "./config";
import { storiesRouter } from "./routes/stories";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/stories",
  express.static(path.join(__dirname, "..", "public", "stories")),
);

app.use("/api/stories", storiesRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(config.port, () => {
  console.log(`Backend rodando em http://localhost:${config.port}`);
  console.log(`URL pública configurada: ${config.publicBaseUrl}`);
});
