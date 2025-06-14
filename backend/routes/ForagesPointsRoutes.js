
import { Router } from "express";
const drilling = Router();
import { pool } from '../config/postgres.js';

drilling.get("/drilling", async (req, res) => {
  try {
    const result = await pool.query(` SELECT
        gid,
        abréviati,
        nom,
        nirh,
        x,
        y,
        z,
        numéro_de,
        titre_de_l,
        délégati,
        date_d,
        date_fin,
        profondeur,
        débit,
        rabatement,
        ns,
        ph,
        salinité_, 
        rs, 
        entreprise, 
        proge, 
        nature,
        usage, 
        equip, 
        utilisateu, 
        typ_captag,
        crepi, 
        code___nom,
        ST_AsGeoJSON(geom)::json AS geom
       FROM public.forages
	   
    `);
  const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: {
          gid: row.gid,
          abréviati: row.abréviati,
          nom: row.nom,
          nrih: row.nrih,
          x: row.x,
          y: row.y,
          z: row.z,
          numéro_de: row.numéro_de,
          titre_de_l: row.titre_de_l,
          délégati: row.délégati,
          date_d: row.date_d,
          date_fin: row.date_fin,
          profondeur: row.profondeur,
          débit: row.débit,
          rabatement: row.rabatement,
          ns: row.ns,
          ph: row.ph,
          salinité_: row.salinité_,
          rs: row.rs,
          entreprise: row.entreprise,
          proge: row.proge,
          nature: row.nature,
          usage: row.usage,

          equip: row.equip,
          utilisateu: row.utilisateu,
          typ_captag: row.typ_captag,
          crepi: row.crepi,
          code___nom: row.code___nom,

        },
        geom: row.geom,
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error("Error fetching drilling from DB:", err);
    res.status(500).send("Internal Server Error");
  }
});;

drilling.get('/stats/location', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT geom, COUNT(*) AS count FROM forages GROUP BY geom`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default drilling;
