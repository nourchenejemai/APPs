import { Router } from 'express';
const router = Router();
import { pool } from '../config/postgres.js';

router.get('/barrages', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public.barrage ORDER BY gid ASC   LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
router.post('/Addbarrages', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO barrage (
    name,name_ar,name_fr,type_bge,gouver,code,disc,geom
    
    )VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
     
      )
    `;
    const values = [
      form.name, form.name_ar,form.name_fr,form.type_bge,form.gouver,form.code,form.disc
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Barrage ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Barrage' });
  }
})

router.put('/barrages/:gid', async (req, res) => {
  try {
    const id = req.params.gid;
    const form = req.body;

    const query = `
      UPDATE barrage SET
        name = $1,
        name_ar = $2,
        name_fr = $3,
        type_bge = $4,
        gouver = $5,
        code = $6,
        disc = $7,
        geom = $8
      WHERE gid = $9
    `;

    const values = [
      form.name,
      form.name_ar,
      form.name_fr,
      form.type_bge,
      form.gouver,
      form.code,
      form.disc,
      form.geom,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Barrage non trouvé, mise à jour non effectuée.' });
    }
    res.status(200).json({ message: 'Barrage mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Barrage' });
  }
});

router.delete('/barrages/:gid', async(req, res)=>{
  try{
    const id = req.params.gid;
    const form= req.body;

    const query = `DELETE FROM barrage WHERE gid=$1`;
        const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Barrage non trouvé, suppression non effectuée.' });
    }
    res.status(200).json({ message: 'Barrage supprimer avec succés' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Barrage  '})
  }

});

export default router;