import { Router } from "express";
import { pool } from '../config/postgres.js';


const bizerteRoute = Router();

bizerteRoute.get('/gouvernorat', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        gid, objectid, code_gouve, nom_gouver,
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry
      FROM public.gouvernorat
      WHERE code_gouve = 17;  -- optionnel : ne garder que Bizerte
    `);
    console.log("PostGIS rows:", result.rowCount);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        gid: row.gid,
        objectid: row.objectid,
        code_gouve: row.code_gouve,
        nom_gouver: row.nom_gouver
      }
    }));

    res.json({ type: "FeatureCollection", features });
  } catch (err) {
    console.error("🔥 Query error:", err.message, err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default bizerteRoute;
