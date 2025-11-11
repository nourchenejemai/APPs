import { Router } from 'express';
const vertisol = Router();
import { pool } from '../config/postgres.js';
// GET count of vertisol
vertisol.get('/vertisol/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM public."Vertisols_BZ" ');
    const count = parseInt(result.rows[0].count);
    
    res.json({
      success: true,
      totalVertisol: count
    });
  } catch (error) {
    console.error('Error counting vertisol:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to count vertisol' 
    });
  }
});
vertisol.get('/vertisols', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public."Vertisols_BZ" ORDER BY id ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
vertisol.post('/Addvertisol', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public."Vertisols_BZ"(
	geom, couleur, typecoul)
    VALUES (
        $1, $2, $3
     
      )
    `;
    const values = [
      form.geom, 
      form.couleur,
      form.typecoul
      
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Vertisol ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Vertisol' });
  }
})
vertisol.put('/vertisols/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public."Vertisols_BZ" SET
    geom=$1, 
    couleur=$2, 
    typecoul=$3

	WHERE id = $4

    `;
   const values = [
       form.geom, 
      form.couleur,
      form.typecoul,
     
      id
    ];

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Vertisol non trouvé, mise à jour non effectuée.' });
    }
    res.status(200).json({ message: 'Vertisol mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Vertisol' });
  }
});
vertisol.delete('/vertisols/:id' , async(req,res)=>{
  try{
    const id = req.params.id;

    const query = `DELETE FROM public."Vertisols_BZ" WHERE id=$1`;
    const result = await pool.query(query,[id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Vertisol non trouvé, suppression non effectuée.' });
    }
    res.status(200).json({ message: 'Vertisol supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Vertisol  '})
  }

});

export default vertisol;