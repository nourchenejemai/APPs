import { Router } from "express";
import { pool } from '../config/postgres.js';

const delegationbz = Router();

delegationbz.get("/delegationbz", async (req, res) => {
  try {
    const result = await pool.query(`
     SELECT 
     id,
      ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry, 
     object, 
     altnamef, 
     reftncod, 
     codegouv, 
     nomgouv, 
     shapeleng,
    shapearea
	  FROM public."Delegations_Bizerte_UTM";
    `);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        object: row.object,
        altnamef: row.altnamef,
        reftncod: row.reftncod,
        codegouv: row.codegouv,
        nomgouv: row.nomgouv,
        shapeleng: row.shapeleng,
        shapearea: row.shapearea
      }
    }));

    res.json({
      type: "FeatureCollection",
      features
    });
  } catch (err) {
    console.error("Error fetching Delegation data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default delegationbz;
