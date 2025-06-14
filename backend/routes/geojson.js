import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/bizerte", (req, res) => {
  const filePath = path.join(__dirname, "../data/bizerte.geojson");

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const geojson = JSON.parse(data);
    res.json(geojson);
  } catch (err) {
    console.error("GeoJSON read or parse error:", err);
    res.status(500).send("Error loading GeoJSON");
  }
});

export default router;
