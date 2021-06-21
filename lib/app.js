const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

app.use('/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/types', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, name
      FROM categories
      ORDER BY name
    `);
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/magicItems', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT mi.id, mi.name, t.name as type, mi.level, mi.cursed, mi.effect, mi.owner_id
    FROM magicItems AS mi
    JOIN types AS t
    ON mi.type_id = t.id;
    `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/magicItems/:id', async(req, res) => {
  try {
    const data = await client.query(`
      SELECT mi.id, mi.name, t.name as type, mi.level, mi.cursed, mi.effect, mi.owner_id
      FROM magicItems AS mi
      JOIN types AS t
      ON mi.type_id = t.id
      WHERE mi.id = $1;
    `, [req.params.id]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/magicItems', async(req, res) => {
  try {
    const data = await client.query(`
      INSERT INTO magicItems (name, type_id, level, cursed, effect, owner_id)
      VALUES ($1, $2, $3, $4, $5, 1)
      RETURNING *`, [req.body.name, req.body.type_id, req.body.level, req.body.cursed, req.body.effect]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.put('/magicItems/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE magicItems
      SET 
          name=$1,
          type_id=$2,
          level=$3,
          cursed=$4,
          effect=$5
      WHERE id=$6
      RETURNING *
    `, [req.body.name, req.body.type_id, req.body.level, req.body.cursed, req.body.effect, req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.delete('/magicItems/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE FROM magicItems WHERE id=$1', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
