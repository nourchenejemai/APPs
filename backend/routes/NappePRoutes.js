import { Router } from 'express';
const nappep = Router();
import { pool } from '../config/postgres.js';
// GET count of nappes
nappep.get('/nappes-profondes/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM public."NappeProfonde"');
    const count = parseInt(result.rows[0].count);
    
    res.json({
      success: true,
      totalNappesP: count
    });
  } catch (error) {
    console.error('Error counting nappe profond:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to count nappe profond' 
    });
  }
});
nappep.get('/nappesp', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public."NappeProfonde" ORDER BY id ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
nappep.post('/Addnappep', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public."NappeProfonde" (
    geom ,surface ,perimetre,npride,nprnom,nprcod,nprres,nprexp,
    nprqmi,nprqma,exploit
    
    )VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11
     
      )
    `;
    const values = [
      form.geom, form.surface,form.perimetre,form.npride,form.nprnom,form.nprcod,form.nprres,
      form.nprexp,form.nprqmi,form.nprqma,form.exploit
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Nappe profonde ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Nappe Profonde' });
  }
})
nappep.put('/nappesp/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public."NappeProfonde" SET
    geom = $1,
    surface = $2,
    perimetre = $3,
    npride = $4,
    nprnom = $5,
    nprcod = $6,
    nprres = $7,
    nprexp = $8,
    nprqmi = $9,
    nprqma = $10,
    exploit = $11
    WHERE id = $12

    `;
   const values = [
      form.geom,
      form.surface,
      form.perimetre,
      form.npride,
      form.nprnom,
      form.nprcod,
      form.nprres,
      form.nprexp,
      form.nprqmi,
      form.nprqma,
      form.exploit,
      id
    ];

  const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nappe Profonde non trouvé, mise à jour non effectuée.' });
    }    res.status(200).json({ message: 'Nappe Profonde mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Nappe Profonde' });
  }
});
nappep.delete('/nappesp/:id' , async(req,res)=>{
  try{
    const id = req.params.id;

    const query = `DELETE FROM public."NappeProfonde" WHERE id=$1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nappe Profonde non trouvé, suppression non effectuée.' });
    }
    res.status(200).json({ message: 'Nappe Profonde supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Nappe Profonde  '})
  }

});

export default nappep;