import { Router } from 'express';
const pedolog = Router();
import { pool } from '../config/postgres.js';

pedolog.get('/pedologie', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(
      'SELECT * FROM public."PEDOLOGIE" ORDER BY id ASC  LIMIT $1 OFFSET $2'
      , [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
pedolog.post('/Addpedologie', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public."PEDOLOGIE" (
    geom ,code ,surface,perimetre,couleur,rocheme,texture,salure,acteau,
    chargca,profond
    
    )VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11
     
      )
    `;
    const values = [
      form.geom, form.code,form.surface,form.perimetre,form.couleur,form.rocheme,form.texture,form.salure,
      form.acteau,form.chargca,form.profond
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Pedologie ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Pedologie' });
  }
})
pedolog.put('/pedologie/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public."PEDOLOGIE" SET
    geom = $1,
    code = $2,
    surface = $3,
    perimetre = $4,
    couleur = $5,
    rocheme = $6,
    texture = $7,
    salure = $8,
    acteau = $9,
    chargca = $10,
    profond = $11
    WHERE id = $12

    `;
   const values = [
      form.geom,
      form.code,
      form.surface,
      form.perimetre,
      form.couleur,
      form.rocheme,
      form.texture,
      form.salure,
      form.acteau,
      form.chargca,
      form.profond,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pedologie non trouvé, mise à jour non effectuée.' });
    }    res.status(200).json({ message: 'Pedologie mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Pedologie' });
  }
});
pedolog.delete('/pedologie/:id' , async(req,res)=>{
  try{
    const id = req.params.id;
    const form= req.body;

    const query = `DELETE FROM public."PEDOLOGIE" WHERE id=$1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pedologie non trouvé, suppression non effectuée.' });
    }
    res.status(200).json({ message: 'Pedologie supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Pedologie  '})
  }

});

export default pedolog;