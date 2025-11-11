import { Router } from 'express';
const geo = Router();
import { pool } from '../config/postgres.js';
// GET count of geologie
geo.get('/geologie/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM public.geologie_bizerte ');
    const count = parseInt(result.rows[0].count);
    
    res.json({
      success: true,
      totalGeologie: count
    });
  } catch (error) {
    console.error('Error counting geologie:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to count geologie' 
    });
  }
});
geo.get('/geologie', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public.geologie_bizerte ORDER BY id ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
geo.post('/Addgeologie', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public.geologie_bizerte(
	geom, superficie, age, lithologie, code, descript)
    
    VALUES (
        $1, $2, $3, $4, $5, $6
     
      )
    `;
    const values = [
      form.geom, 
      form.superficie,
      form.age,
      form.lithologie,
      form.code,
      form.descript
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Geologie ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Geologie' });
  }
})
geo.put('/geologie/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public.geologie_bizerte SET
    geom = $1,
    superficie = $2,
    age = $3,
    lithologie = $4,
    code = $5,
    descript = $6
    WHERE id = $7

    `;
   const values = [
      form.geom,
      form.superficie,
      form.age,
      form.lithologie,
      form.code,
      form.descript,
   
      id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Geologie  non trouvé, mise à jour non effectuée.' });
    }    res.status(200).json({ message: 'Geologie mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Geologie' });
  }
});
geo.delete('/geologie/:id' , async(req,res)=>{
  try{
    const id = req.params.id;
    const form= req.body;

    const query = `DELETE FROM public.geologie_bizerte WHERE id=$1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Geologie non trouvé, suppression non effectuée.' });
    }    res.status(200).json({ message: 'Geologie supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Geologie'})
  }

});

export default geo;