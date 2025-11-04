import { config } from 'dotenv';

config({ path: './config.env' });
import app from './app.js';

const port = process.env.PORT || 8000;

app.listen(port, err => {
  console.log(`App listening on port: ${port}`);
});
