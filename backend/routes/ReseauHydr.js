import { Router } from 'express';
const reseauHydr = Router();
import { pool } from '../config/postgres.js';

reseauHydr.get('/reseauHydr', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public."Reseaux_Hydrographiques" ORDER BY id ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
reseauHydr.post('/AddreseauHydr', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public."Reseaux_Hydrographiques"(
	geom, longeur, hylide, hyltyp, hylnom)
    VALUES (
        $1, $2, $3, $4, $5
     
      )
    `;
    const values = [
      form.geom, 
      form.longeur,
      form.hylide,
      form.hyltyp,
      form.hylnom
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Reseaux Hydrographiques ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Reseaux Hydrographiques' });
  }
})
reseauHydr.put('/reseauHydr/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public."Reseaux_Hydrographiques" SET
    geom=$1, 
    longeur=$2, 
    hylide=$3, 
    hyltyp=$4, 
    hylnom=$5

	WHERE id = $6

    `;
   const values = [
       form.geom, 
      form.longeur,
      form.hylide,
      form.hyltyp,
      form.hylnom,
      id
    ];

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Reseaux Hydrographiques non trouvé, mise à jour non effectuée.' });
    }
    res.status(200).json({ message: 'Reseaux Hydrographiques mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Reseaux Hydrographiques' });
  }
});
reseauHydr.delete('/reseauHydr/:id' , async(req,res)=>{
  try{
    const id = req.params.id;

    const query = `DELETE FROM public."Reseaux_Hydrographiques" WHERE id=$1`;
    const result = await pool.query(query,[id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Reseaux Hydrographiques non trouvé, suppression non effectuée.' });
    }
    res.status(200).json({ message: 'Reseaux Hydrographiques supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Reseaux Hydrographiques  '})
  }

});
reseauHydr.get('/reseauHydr/:id', async (req, res) => {
  const id = parseInt(req.params.id); // extraire l'id de l'URL

  try {
    const result = await pool.query(
      'SELECT * FROM public."Reseaux_Hydrographiques" WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reseau hydrographique not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching data by ID:', error);
    res.status(500).json({ error: 'Failed to fetch reseau hydrographique by ID' });
  }
});


export default reseauHydr;