import { Router } from "express";
import { pool } from '../config/postgres.js';

const reseau = Router();

reseau.get("/reseauPoint", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, 
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry,
        longeur, 
        hylide, 
        hyltyp, 
        hylnom
      FROM public."Reseaux_Hydrographiques"
    `);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        longeur: row.longeur,
        hylide: row.hylide,
        hyltyp: row.hyltyp,
        hylnom: row.hylnom
      }
    }));

    res.json({
      type: "FeatureCollection",
      features
    });
  } catch (err) {
    console.error("Error fetching Reseaux Hydrographiques data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default reseau;
