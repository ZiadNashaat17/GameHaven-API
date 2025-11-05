import { config } from 'dotenv';
import { connect } from 'mongoose';

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!! Shutting down');
  console.log(err.name, err.message);

  process.exit(1);
});

config({ path: './config.env' });
import app from './app.js';

const DB = process.env.DATABASE;
connect(DB).then(con => {
  console.log('DB connection successful!');
});

const port = process.env.PORT || 8000;

const server = app.listen(port, err => {
  console.log(`App listening on port: ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION!! Shutting down');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
