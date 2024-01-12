import express, { json } from 'express';
import { findOne, findOneAndUpdate } from './models/Contribution';

import { connect } from 'mongoose';

const app = express();
app.use(json());

connect('mongodb://localhost:27017/trip', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/data', async (req, res) => {
  const contribution = await findOne();
  res.json(contribution);
});

app.post('/data', async (req, res) => {
  const { students, sponsors } = req.body;
  const contribution = await findOneAndUpdate({}, { students, sponsors }, { new: true, upsert: true });
  res.json(contribution);
});

app.listen(3001, () => console.log('Server running on port 3001'));
