import express, { json } from 'express';

import axios from 'axios';
import { connect } from 'mongoose';
import { findOneAndUpdate } from './models/Contribution';

const app = express();
app.use(json());

connect('mongodb://localhost:27017/trip', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/data', async (req, res) => {
  try {
    const { data } = await axios.get('https://localhost:3001/data');
    res.json(data);
  } catch (error) {
    console.error('Error fetching contribution data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/data', async (req, res) => {
  const { students, sponsors } = req.body;
  const contribution = await findOneAndUpdate({}, { students, sponsors }, { new: true, upsert: true });
  res.json(contribution);
});

app.listen(3001, () => console.log('Server running on port 3001'));
