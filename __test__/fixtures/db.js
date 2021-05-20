require('dotenv').config();
const { MongoClient } = require('mongodb');

const host = process.env.DB_TEST_HOST;
const port = process.env.DB_TEST_PORT;
const dbName = process.env.DB_TEST_NAME;
const url = `mongodb://${host}:${port}`;

let db;
let connection;

async function makeDb() {
  connection =
    connection ||
    (await MongoClient.connect(url, {
      useUnifiedTopology: true,
    }));
  db = await connection.db(dbName);
  return db;
}

async function closeDb() {
  if (!connection) return;
  await connection.close();
}

async function clearDb() {
  if (!db) return false;
  await db.collection('transactions').deleteMany({});
  await db.collection('billAssumption').deleteMany({});
  await db.collection('billStock').deleteMany({});
  await db.collection('billTaking').deleteMany({});
  return true;
}

module.exports = { makeDb, closeDb, clearDb };
