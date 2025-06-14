import { Router } from "express";
import { pool } from '../config/postgres.js';

const vert = Router();

vert.get("/vertisolPoint", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, 
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry, 
        couleur, 
        typecoul
        FROM public."Vertisols_BZ"
    `);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        couleur: row.couleur,
        typecoul: row.typecoul
      }
    }));

    res.json({
      type: "FeatureCollection",
      features
    });
  } catch (err) {
    console.error("Error fetching Vertisol data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default vert;
