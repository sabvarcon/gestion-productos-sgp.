import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret_that_is_long_enough_for_unit_tests_123';
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) await collections[key].deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
