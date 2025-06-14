import { Router } from 'express';
const climat = Router();
import { pool } from '../config/postgres.js';

climat.get('/climat', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public."climat_Bizerte" ORDER BY id ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
climat.post('/Addclimat', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public."climat_Bizerte"(
	geom, surface, perimetre, clmide, clmnom, clmcla, clmmox)
    
    VALUES (
        $1, $2, $3, $4, $5, $6, $7
     
      )
    `;
    const values = [
      form.geom, form.surface,form.perimetre,form.clmide,form.clmnom,form.clmcla,
      form.climox
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Climat ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Climat' });
  }
})
climat.put('/climat/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public."climat_Bizerte" SET
    geom = $1,
    surface = $2,
    perimetre = $3,
    clmide = $4,
    clmnom = $5,
    clmcla = $6,
    clmmox = $7
    WHERE id = $8

    `;
   const values = [
      form.geom,
      form.surface,
      form.perimetre,
      form.clmide,
      form.clmnom,
      form.clmcla,
      form.clmmox,
   
      id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Climat  non trouvé, mise à jour non effectuée.' });
    }    res.status(200).json({ message: 'Climat mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Climat' });
  }
});
climat.delete('/climat/:id' , async(req,res)=>{
  try{
    const id = req.params.id;
    const form= req.body;

    const query = `DELETE FROM public."climat_Bizerte" WHERE id=$1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Climat non trouvé, suppression non effectuée.' });
    }    res.status(200).json({ message: 'Climat supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Climat'})
  }

});

export default climat;