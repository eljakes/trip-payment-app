import { Schema, model } from 'mongoose';

const ContributionSchema = new Schema({
  students: [{ paid: Number }],
  sponsors: [{ name: String, contribution: Number }]
});

export default model('Contribution', ContributionSchema);
