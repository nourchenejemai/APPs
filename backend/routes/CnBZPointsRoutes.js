import { Router } from "express";
const cnbz = Router();
import { pool } from '../config/postgres.js';

cnbz.get("/cnbz", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry,
        object,
        fnode,
        tnode,
        lpoly,
        rpoly,
        lengthh,
        cnv1,
        cnv1id,
        cnvalt,
        shapeleng
      FROM public."CN_Bizerte"
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: row.geometry, 

        properties: {
          id: row.id,
          object: row.object,
          fnode: row.fnode,
          tnode: row.tnode,
          lpoly: row.lpoly,
          rpoly: row.rpoly,
          lengthh: row.lengthh,
          cnv1: row.cnv1,
          cnv1id: row.cnv1id,
          cnvalt: row.cnvalt,
          shapeleng: row.shapeleng,
        },
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error("Error fetching CN_Bizerte from DB:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default cnbz;
