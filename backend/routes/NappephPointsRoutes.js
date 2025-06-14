import { Router } from "express";
const nappeph = Router();
import { pool } from '../config/postgres.js';

nappeph.get("/nappePh", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry,
        surface,
        perimetre,
        nphide,
        nphnom,
        nphcod,
        nphres,
        nphexp,
        nphqmi,
        nphqma
      FROM public."NappePhreatique"
    `);

  const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,

      properties: {
        id: row.id,
        surface: row.surface,
        perimetre: row.perimetre,
        nphide: row.nphide,
        nphnom: row.nphnom,
        nphcod: row.nphcod,
        nphres: row.nphres,
        nphexp: row.nphexp,
        nphqmi: row.nphqmi,
        nphqma: row.nphqma
      },
    }));

    res.json({
      type: "FeatureCollection",
      features,
    });
  } catch (err) {
    console.error("Error fetching nappePh data:", err);
    res.status(500).send("Internal Server Error");
  }
});
export default nappeph;
