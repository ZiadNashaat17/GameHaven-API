import mongoose from 'mongoose';
import redis from 'redis';

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient({ url: redisUrl });
const exec = mongoose.Query.prototype.exec;

client.connect();

mongoose.Query.prototype.exec = async function () {
  // we use Object.assign to safely copy properties from one object to another
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // see if we have a value fro 'key' in redis
  const cacheValue = await client.get(key);
  // if we do, return that
  if (cacheValue) {
    console.log(cacheValue);

    return JSON.parse(cacheValue);
  }
  // otherwise, issue the query and store the results in redis
  const result = await exec.apply(this, arguments);

  client.set(key, JSON.stringify(result));

  return result;
};

// next vid: Hydrating Models
