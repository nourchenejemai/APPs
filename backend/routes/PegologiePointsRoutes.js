import { Router } from "express";
import { pool } from '../config/postgres.js';

const pedol = Router();

pedol.get("/pedologiePoint", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, 
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry,
        code, 
        surface, 
        perimetre, 
        couleur, 
        rocheme, 
        texture, 
        salure, 
        acteau, 
        chargca, 
        profond
      FROM public."PEDOLOGIE"
    `);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        code: row.code,
        surface: row.surface,
        perimetre: row.perimetre,
        couleur: row.couleur,
        rocheme: row.rocheme,
        texture: row.texture,
        salure: row.salure,
        acteau: row.acteau,
        chargca: row.chargca,
        profond: row.profond
      }
    }));

    res.json({
      type: "FeatureCollection",
      features
    });
  } catch (err) {
    console.error("Error fetching Pedologie data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default pedol;
