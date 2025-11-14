import mongoose from 'mongoose';
import redis from 'redis';

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient({ url: redisUrl });
const exec = mongoose.Query.prototype.exec;

client.connect();

mongoose.Query.prototype.cache = function () {
  this.useCache = true;

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
  const cacheValue = await client.get(key);
  // if we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    // return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);

    if (Array.isArray(doc)) {
      return doc.map(d => {
        console.log('doc is array log: ', d);
        console.log('this.model log: ', new this.model(d));

        return new this.model(d);
      });
    } else {
      console.log(doc);
      // return new this.model(doc);
    }
  }
  // otherwise, issue the query and store the results in redis
  const result = await exec.apply(this, arguments);

  client.set(key, JSON.stringify(result));

  return result;
};

// next vid: Hydrating Models
