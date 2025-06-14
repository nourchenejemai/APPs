import { Router } from "express";
const nappepro = Router();
import { pool } from '../config/postgres.js';

nappepro.get("/nappePro", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry,
         surface, 
         perimetre, 
         npride, 
         nprnom, 
         nprcod,          
         nprres, 
         nprexp, 
         nprqmi, 
         nprqma
      FROM public."NappeProfonde"
    `);

  const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,

      properties: {
        id: row.id,
        surface: row.surface,
        perimetre: row.perimetre,
        npride: row.npride,
        nprnom: row.nprnom,
        nprcod: row.nprcod,
        nprres: row.nprres,
        nprexp: row.nprexp,
        nprqmi: row.nprqmi,
        nprqma: row.nprqma      },
    }));

    res.json({
      type: "FeatureCollection",
      features,
    });
  } catch (err) {
    console.error("Error fetching nappe Profond data:", err);
    res.status(500).send("Internal Server Error");
  }
});
export default nappepro;
