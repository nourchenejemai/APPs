import { Router } from 'express';
const forage = Router();
import { pool } from '../config/postgres.js';

// GET count of barrages
forage.get('/forages/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM public.forages');
    const count = parseInt(result.rows[0].count);
    
    res.json({
      success: true,
      totalForages: count
    });
  } catch (error) {
    console.error('Error counting forages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to count forages' 
    });
  }
});

// GET forages with pagination
forage.get('/forages', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM public.forages ORDER BY gid ASC  LIMIT $1 OFFSET $2', [limit, offset]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});

// GET forages by titre_de_l
forage.get('/forages/titre/:titre', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const titre = req.params.titre;
  
  try {
    // Récupérer les forages par titre avec pagination
    const result = await pool.query(
      'SELECT * FROM public.forages WHERE titre_de_l = $1 ORDER BY gid ASC LIMIT $2 OFFSET $3', 
      [titre, limit, offset]
    );
    
    // Récupérer le count total pour ce titre
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM public.forages WHERE titre_de_l = $1', 
      [titre]
    );
    const totalCount = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      forages: result.rows,
      titre: titre,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalForages: totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching forages by titre:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch forages by titre' 
    });
  }
});

// POST Add forages
forage.post('/Addforages', async (req, res) => {
  try {
    const form = req.body;

    const query = `
      INSERT INTO forages (
        abréviati, nom, nirh, x, y, z, numéro_de, titre_de_l, délégati, date_d, date_fin,
        profondeur, débit, rabatement, ns, ph, salinité_, rs, entreprise, proge, nature,
        usage, equip, utilisateu, typ_captag, crepi, code___nom
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26, $27
      )
    `;

    const values = [
      form.abréviati, form.nom, form.nirh, form.x, form.y, form.z, form.numéro_de, form.titre_de_l, form.délégati,
      form.date_d, form.date_fin, form.profondeur, form.débit, form.rabatement, form.ns, form.ph, form.salinité_,
      form.rs, form.entreprise, form.proge, form.nature, form.usage, form.equip, form.utilisateu,
      form.typ_captag, form.crepi, form.code___nom
    ];

    await pool.query(query, values);

    res.status(201).json({ message: 'Forage ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du forage' });
  }
});

// PUT Update forages
forage.put('/forages/:gid', async (req, res) => {
  try {
        const id = req.params.gid;
        const form = req.body;

    const query = `
      UPDATE forages SET
        abréviati = $1, nom = $2, nirh = $3, x = $4, y = $5, z = $6, numéro_de = $7, titre_de_l = $8,
        délégati = $9, date_d = $10, date_fin = $11, profondeur = $12, débit = $13, rabatement = $14,
        ns = $15, ph = $16, salinité_ = $17, rs = $18, entreprise = $19, proge = $20, nature = $21,
        usage = $22, equip = $23, utilisateu = $24, typ_captag = $25, crepi = $26, code___nom = $27
      WHERE gid = $28
    `;

    const values = [
      form.abréviati, form.nom, form.nirh, form.x, form.y, form.z, form.numéro_de, form.titre_de_l, form.délégati,
      form.date_d, form.date_fin, form.profondeur, form.débit, form.rabatement, form.ns, form.ph, form.salinité_,
      form.rs, form.entreprise, form.proge, form.nature, form.usage, form.equip, form.utilisateu,
      form.typ_captag, form.crepi, form.code___nom,id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Forage non trouvé, mise à jour non effectuée.' });
    }
    res.status(201).json({ message: 'Forage mis à jour succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du forage' });
  }
});

// DELETE forages
forage.delete('/forages/:gid', async (req, res) => {
  try {
    const id = req.params.gid;

    const query = `DELETE FROM forages WHERE gid = $1`;
    const result = await pool.query(query, [id])
   if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Forage non trouvé, suppression non effectuée.' });
    }

    res.status(200).json({ message: 'Forage successfully removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting forage' });
  }
});

// GET forage by ID
forage.get('/forages/:gid', async (req, res) => {
  const gid = parseInt(req.params.gid); // extraire l'id de l'URL

  try {
    const result = await pool.query(
      'SELECT * FROM forages WHERE gid = $1',
      [gid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Forages not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching data by ID:', error);
    res.status(500).json({ error: 'Failed to fetch forages by ID' });
  }
});

export default forage;