import { Router } from 'express';
const nappe = Router();
import { pool } from '../config/postgres.js';

nappe.get('/nappes', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public."NappePhreatique" ORDER BY id ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
nappe.post('/AddNappePh', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public."NappePhreatique" (
    geom ,surface ,perimetre,nphide,nphnom,nphcod,nphres,nphexp,
    nphqmi,nphqma
    
    )VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,$10
     
      )
    `;
    const values = [
      form.geom, form.surface,form.perimetre,form.nphide,form.nphnom,form.nphcod,form.nphres,
      form.nphexp,form.nphqmi,form.nphqma
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Nappe ph ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Nappe Ph' });
  }
})
nappe.put('/nappes/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public."NappePhreatique" SET
    geom = $1,
    surface = $2,
    perimetre = $3,
    nphide = $4,
    nphnom = $5,
    nphcod = $6,
    nphres = $7,
    nphexp = $8,
    nphqmi = $9,
    nphqma = $10
    WHERE id = $11

    `;
   const values = [
      form.geom,
      form.surface,
      form.perimetre,
      form.nphide,
      form.nphnom,
      form.nphcod,
      form.nphres,
      form.nphexp,
      form.nphqmi,
      form.nphqma,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nappe Phreatique non trouvé, mise à jour non effectuée.' });
    }    res.status(200).json({ message: 'Nappe Phreatique mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Nappe Phreatique' });
  }
});
nappe.delete('/nappes/:id' , async(req,res)=>{
  try{
    const id = req.params.id;
    const form= req.body;

    const query = `DELETE FROM public."NappePhreatique" WHERE id=$1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nappe Phreatique non trouvé, suppression non effectuée.' });
    }    res.status(200).json({ message: 'Nappe Phreatique supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Nappe Phreatique  '})
  }

});

export default nappe;