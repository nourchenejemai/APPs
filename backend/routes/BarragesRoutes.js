import { Router } from 'express';
const router = Router();
import { pool } from '../config/postgres.js';

// GET count of barrages
router.get('/barrages/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM public.barrage');
    const count = parseInt(result.rows[0].count);
    
    res.json({
      success: true,
      totalBarrages: count
    });
  } catch (error) {
    console.error('Error counting barrages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to count barrages' 
    });
  }
});

// GET barrages with pagination (votre route existante)
router.get('/barrages', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  
  try {
    const result = await pool.query(
      'SELECT * FROM public.barrage ORDER BY gid ASC LIMIT $1 OFFSET $2', 
      [limit, offset]
    );
    
    // Récupérer aussi le count total pour la pagination
    const countResult = await pool.query('SELECT COUNT(*) FROM public.barrage');
    const totalCount = parseInt(countResult.rows[0].count);
    
    res.json({
      barrages: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalBarrages: totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching PostgreSQL data:', error);
    res.status(500).json({ error: 'Failed to fetch PostgreSQL data' });
  }
});

// GET barrages by type
router.get('/barrages/type/:type', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const type = req.params.type;
  
  try {
    // Récupérer les barrages par type avec pagination
    const result = await pool.query(
      'SELECT * FROM public.barrage WHERE type_bge = $1 ORDER BY gid ASC LIMIT $2 OFFSET $3', 
      [type, limit, offset]
    );
    
    // Récupérer le count total pour ce type
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM public.barrage WHERE type_bge = $1', 
      [type]
    );
    const totalCount = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      barrages: result.rows,
      type: type,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalBarrages: totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching barrages by type:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch barrages by type' 
    });
  }
});

// GET detailed statistics for barrages
router.get('/barrages/stats', async (req, res) => {
  try {
    // Count total
    const totalResult = await pool.query('SELECT COUNT(*) FROM public.barrage');
    const totalBarrages = parseInt(totalResult.rows[0].count);

    // Count by type_bge
    const typeStats = await pool.query(`
      SELECT type_bge, COUNT(*) as count 
      FROM public.barrage 
      GROUP BY type_bge 
      ORDER BY count DESC
    `);

    // Count by gouver (gouvernorat)
    const regionStats = await pool.query(`
      SELECT gouver, COUNT(*) as count 
      FROM public.barrage 
      GROUP BY gouver 
      ORDER BY count DESC
    `);

    // Recent barrages (last 10)
    const recentBarrages = await pool.query(`
      SELECT * FROM public.barrage 
      ORDER BY gid DESC 
      LIMIT 10
    `);

    res.json({
      success: true,
      stats: {
        totalBarrages,
        byType: typeStats.rows,
        byRegion: regionStats.rows,
        recentBarrages: recentBarrages.rows
      }
    });
  } catch (error) {
    console.error('Error fetching barrage statistics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch barrage statistics' 
    });
  }
});

// POST Add barrages (votre route existante)
router.post('/Addbarrages', async (req, res) => {
  try {
    const form = req.body;
    const query = `
      INSERT INTO barrage (
        name, name_ar, name_fr, type_bge, gouver, code, disc, geom
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
      form.name, form.name_ar, form.name_fr, form.type_bge, 
      form.gouver, form.code, form.disc, form.geom
    ];
    
    await pool.query(query, values);
    res.status(201).json({ message: 'Barrage ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Barrage' });
  }
});

// PUT Update barrages (votre route existante)
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
      form.name, form.name_ar, form.name_fr, form.type_bge,
      form.gouver, form.code, form.disc, form.geom, id
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

// DELETE barrages (votre route existante)
router.delete('/barrages/:gid', async (req, res) => {
  try {
    const id = req.params.gid;
    const query = `DELETE FROM barrage WHERE gid = $1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Barrage non trouvé, suppression non effectuée.' });
    }
    res.status(200).json({ message: 'Barrage supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de supprimer Barrage' });
  }
});

export default router;