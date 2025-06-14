import { query } from '../config/database'; 

app.get('/api/users', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});