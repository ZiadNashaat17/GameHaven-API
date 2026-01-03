import mongoose from 'mongoose';
import redis from 'redis';

// const redisUrl = 'redis://redis:6379';
const client = redis.createClient({ url: process.env.REDIS_URL });
const exec = mongoose.Query.prototype.exec;

await client.connect();

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  // we use Object.assign to safely copy properties from one object to another
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // see if we have a value fro 'key' in redis
  const cacheValue = await client.hGet(this.hashKey, key);
  // if we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc) ? doc.map(d => this.model.hydrate(d)) : this.model.hydrate(doc);
  }
  // otherwise, issue the query and store the results in redis
  const result = await exec.apply(this, arguments);

  client.hSet(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  return result;
};

export const clearHash = function (hashKey) {
  client.del(JSON.stringify(hashKey));
};
