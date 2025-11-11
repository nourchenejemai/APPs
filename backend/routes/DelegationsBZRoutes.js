import { Router } from 'express';
const del = Router();
import { pool } from '../config/postgres.js';
// GET count of delegation
del.get('/delegation/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM public."Delegations_Bizerte_UTM"');
    const count = parseInt(result.rows[0].count);
    
    res.json({
      success: true,
      totalDelegation: count
    });
  } catch (error) {
    console.error('Error counting delegation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to count delegation' 
    });
  }
});
del.get('/delegation', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public."Delegations_Bizerte_UTM" ORDER BY id ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
del.post('/Adddelegation', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public."Delegations_Bizerte_UTM"(
    geom,object, altnamef, reftncod, codegouv, nomgouv, shapeleng, shapearea)
    
    VALUES (
        ST_GeomFromText($1, 32632), $2, $3, $4, $5, $6, $7,$8
     
      )
    `;
    const values = [
      form.geom,
      form.object,
      form.altnamef,
      form.reftncod,
      form.codegouv,
      form.nomgouv,
      form.shapeleng,
      form.shapearea
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'Delegation ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Delegation' });
  }
})
del.put('/delegation/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public."Delegations_Bizerte_UTM" SET
    geom=$1, 
    object=$2, 
    altnamef=$3, 
    reftncod=$4, 
    codegouv=$5, 
    nomgouv=$6, 
    shapeleng=$7, 
    shapearea=$8
   
	WHERE id = $9

    `;
   const values = [
      form.geom,
      form.object,
      form.altnamef,
      form.reftncod,
      form.codegouv,
      form.nomgouv,
      form.shapeleng,
      form.shapearea,
      id
    ];

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Delegation non trouvé, mise à jour non effectuée.' });
    }
    res.status(200).json({ message: 'Delegation mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du Delegation' });
  }
});
del.delete('/delegation/:id' , async(req,res)=>{
  try{
    const id = req.params.id;

    const query = `DELETE FROM public."Delegations_Bizerte_UTM" WHERE id=$1`;
    const result = await pool.query(query,[id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Delegation non trouvé, suppression non effectuée.' });
    }
    res.status(200).json({ message: 'Delegation supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer Delegation  '})
  }

});

export default del;