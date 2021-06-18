const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const magicItems = require('../data/magicItems');

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

app.get('/magicItems', async(req, res) => {
  try {
    const data = await client.query('SELECT * from magicItems');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/magicItems/:id', (req, res) => {   
  const id = Number(req.params.id);

  const item = magicItems.find((singleItem) => singleItem.id === id);
  res.json(item);
});

app.post('/magicItems', async(req, res) => {
  try {
    const data = await client.query(`
      INSERT INTO magicItems (name, type, level, cursed, effect, owner_id)
      VALUES ($1, $2, $3, $4, $5, 1)
      RETURNING *`, [req.body.name, req.body.type, req.body.level, req.body.cursed, req.body.effect]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(200).json({ error: e.message });
  }
});

app.put('/magicItems/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE magicItems
      SET 
          name=$1,
          type=$2,
          level=$3
          cursed=$4
          effect=$5
      WHERE id=$6
      RETURNING *
    `, [req.body.name, req.body.type, req.body.level, req.body.cursed, req.body.effect, req.params.id]);
    
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
