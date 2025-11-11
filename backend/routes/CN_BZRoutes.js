import { Router } from 'express';
const cnbizerte = Router();
import { pool } from '../config/postgres.js';
// GET count of cnbz
cnbizerte.get('/cnbz/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM public."CN_Bizerte" ');
    const count = parseInt(result.rows[0].count);
    
    res.json({
      success: true,
      totalCourbe: count
    });
  } catch (error) {
    console.error('Error counting courbe:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to count courbe' 
    });
  }
});
cnbizerte.get('/cn', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public."CN_Bizerte" ORDER BY id ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});
cnbizerte.post('/Addcn', async (req, res) => {
   try {
    const form = req.body;

    const query = `INSERT INTO public."CN_Bizerte"(
	geom, object, fnode, tnode, lpoly, rpoly, lengthh, cnv1, cnv1id, cnvalt, shapeleng)
    
    VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11
     
      )
    `;
    const values = [
      form.geom, form.object,form.fnode,form.tnode,form.lpoly,form.rpoly,form.lengthh,
      form.cnv1,form.cn1id,form.cnvalt,form.shapeleng
    ];
   await pool.query(query, values);

    res.status(201).json({ message: 'CN ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du CN' });
  }
})
cnbizerte.put('/cn/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const form = req.body;
    const query = `UPDATE public."CN_Bizerte" SET
    geom=$1, 
    object=$2, 
    fnode=$3, 
    tnode=$4, 
    lpoly=$5, 
    rpoly=$6, 
    lengthh=$7, 
    cnv1=$8, 
    cnv1id=$9, 
    cnvalt=$10, 
    shapeleng=$11
	WHERE id = $12

    `;
   const values = [
      form.geom,
      form.object,
      form.fnode,
      form.tnode,
      form.lpoly,
      form.rpoly,
      form.lengthh,
      form.cnv1,
      form.cnv1id,
      form.cnvalt,
      form.shapeleng,
      id
    ];

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'CN non trouvé, mise à jour non effectuée.' });
    }
    res.status(200).json({ message: 'CN mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du CN' });
  }
});
cnbizerte.delete('/cn/:id' , async(req,res)=>{
  try{
    const id = req.params.id;

    const query = `DELETE FROM public."CN_Bizerte" WHERE id=$1`;
    const result = await pool.query(query,[id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'CN non trouvé, suppression non effectuée.' });
    }
    res.status(200).json({ message: 'CN supprimer avec succées' });

  }catch(error) {
    console.error(error);
    res.status(500).json({message: 'Erreur de supprimer CN  '})
  }

});

export default cnbizerte;