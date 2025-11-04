import { config } from 'dotenv';
import { connect } from 'mongoose';

config({ path: './config.env' });
import app from './app.js';

const DB = process.env.DATABASE;
connect(DB).then(con => {
  console.log('DB connection successful!');
});

const port = process.env.PORT || 8000;
app.listen(port, err => {
  console.log(`App listening on port: ${port}`);
});
