
import { Router } from "express";
const dams = Router();
import { pool } from '../config/postgres.js';

dams.get("/dams", async (req, res) => {
  try {
    const result = await pool.query(` SELECT
        gid,
        name,
        name_ar,
        name_fr,
        type_bge,
        gouver,
        code,
        disc,
        ST_AsGeoJSON(geom)::json AS geom
      FROM public.barrage
    `);
  const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: {
          id: row.id,
          name: row.name,
          name_ar: row.name_ar,
          name_fr: row.name_fr,
          type_bge: row.type_bge,
          gouver: row.gouver,
          code: row.code,
          disc: row.disc,
        },
        geom: row.geom,
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error("Error fetching dams from DB:", err);
    res.status(500).send("Internal Server Error");
  }
});;
dams.get('/stats/location', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT geom, COUNT(*) AS count FROM barage GROUP BY geom`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default dams;
