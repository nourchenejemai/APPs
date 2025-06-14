import { Router } from "express";
import { pool } from '../config/postgres.js';

const climatbz = Router();

climatbz.get("/climatbz", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, 
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry,
        
        surface, 
        perimetre,
        clmide,
        clmnom,
        clmcla,
        clmmox
      FROM public."climat_Bizerte"
    `);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        surface: row.surface,
        perimetre: row.perimetre,
        clmide: row.clmide,
        clmnom: row.clmnom,
        clmcla: row.clmcla,
        clmmox: row.clmmox
      }
    }));

    res.json({
      type: "FeatureCollection",
      features
    });
  } catch (err) {
    console.error("Error fetching Climat data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default climatbz;
