import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Game from '../models/gameModel.js';

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root config.env
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const DB = process.env.DATABASE;

connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });

// Read games.json relative to this file
const games = JSON.parse(readFileSync(path.join(__dirname, 'games.json'), 'utf-8'));

const importData = async () => {
  try {
    await Game.create(games);
    console.log('Data successfully imported!');
  } catch (err) {
    console.error('Import error:', err);
  }
};

const deleteData = async () => {
  try {
    await Game.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.error('Delete error:', err);
  }
};

if (process.argv[2] === '--import') {
  importData()
    .then(() => process.exit())
    .catch(() => process.exit(1));
} else if (process.argv[2] === '--delete') {
  deleteData()
    .then(() => process.exit())
    .catch(() => process.exit(1));
}
