import { Router } from "express";
import { pool } from '../config/postgres.js';

const geologiebz = Router();

geologiebz.get("/geologiebz", async (req, res) => {
  try {
    const result = await pool.query(`
     SELECT 
     id,
      ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry, 
     superficie, 
     age,
     lithologie, 
     code, 
     descript
	FROM public.geologie_bizerte;
    `);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        superficie: row.superficie,
        age: row.age,
        lithologie: row.lithologie,
        code: row.code,
        descript: row.descript
      }
    }));

    res.json({
      type: "FeatureCollection",
      features
    });
  } catch (err) {
    console.error("Error fetching Geologie data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default geologiebz;
